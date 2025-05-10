from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from huggingface_hub import login
from captum.attr import IntegratedGradients
import torch
from peft import PeftModel
import uvicorn
import torch.nn.functional as F
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mindease-74vf8lveu-omahmedce43ceme-nustedupks-projects.vercel.app"],  # Only allow this domain
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods like GET, POST, etc.
    allow_headers=["*"],  # Allow all headers
)


# Define request model
class PredictionRequest(BaseModel):
    prompt: str
    max_length: int = 256
    temperature: float = 0.7
    context: str = ""

class ExplainRequest(BaseModel):
    userInput:str
    content: str


@app.on_event("startup")
async def startup_event():
    global model, tokenizer, generator, device

#     # 🔐 Secure login to Hugging Face using environment variable

#     # HUGGINGFACE_TOKEN = ""
#     # login(token=HUGGINGFACE_TOKEN)

#     HUGGINGFACE_TOKEN = ""
#     login(token=HUGGINGFACE_TOKEN)


    # ✅ Load model and tokenizer
    # ✅ Load model and tokenizer
    MODEL_NAME = "meta-llama/Llama-3.2-3B-Instruct"
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    print("⏳ Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    print("⏳ Loading model...")
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    )
    model.to(device)
    model.eval()
    print("✅ Model and tokenizer loaded successfully!")

    # Pipeline for inference
    generator = pipeline("text-generation", model=model, tokenizer=tokenizer, device=0 if torch.cuda.is_available() else -1)


def clean_token(token: str, tokenizer):
    if token in tokenizer.all_special_tokens:
        return None
    return token.replace('Ġ', '').strip()

def normalize_scores(scores):
    min_score = scores.min()
    max_score = scores.max()
    return (scores - min_score) / (max_score - min_score) if max_score != min_score else scores

def forward_func(embeddings):
    embeddings = embeddings.requires_grad_()
    attention_mask = torch.ones((1, embeddings.size(1))).to(device)
    outputs = model(inputs_embeds=embeddings, attention_mask=attention_mask)
    logits = outputs.logits
    probs = F.softmax(logits[:, -1, :], dim=-1)
    return probs
MENTAL_HEALTH_KEYWORDS = [
    "anxiety", "stress", "depression", "fear", "worry", "sadness", "nervous", "panic", "hopeless", "overwhelmed",
    "isolation", "loneliness", "helpless", "burnout", "guilt", "fatigue", "mental", "crisis", "trauma", "anxious", "sadness"
]
MENTAL_HEALTH_PHRASES = [
    "sleeping issues", "panic attack", "mental health", "feeling anxious", "trouble focusing", "feeling hopeless"
]
COMMON_WORDS = ["i", "am", "is", "have", "are", "the", "it", "was", "a", "in", "on", "with", "feeling"]
 
def explain_response(input_text, target_response):
    encoded = tokenizer(input_text, return_tensors='pt')
    input_ids = encoded['input_ids'].to(device)
    embeddings = model.get_input_embeddings()(input_ids).detach().to(device).requires_grad_()

    ig = IntegratedGradients(forward_func)
    token_ids = tokenizer(target_response, return_tensors='pt')['input_ids'][0, 1:].tolist()

    scores_accum = torch.zeros(input_ids.shape[1]).to(device)
    for token_id in token_ids:
        attributions, _ = ig.attribute(
            inputs=embeddings,
            target=token_id,
            return_convergence_delta=True
        )
        scores_accum += attributions.sum(dim=-1).squeeze(0)

    normalized_scores = normalize_scores(scores_accum)
    tokens = tokenizer.convert_ids_to_tokens(input_ids.squeeze())
    token_scores = list(zip(tokens, normalized_scores.tolist()))

    adjusted_scores = []
    for token, score in token_scores:
        clean = clean_token(token, tokenizer)
        if not clean:
            continue
        clean_lower = clean.lower()
        if clean_lower in MENTAL_HEALTH_KEYWORDS:
            score *= 2.0
        elif clean_lower in COMMON_WORDS:
            score *= 0.25
        adjusted_scores.append((clean, score))

    print("\n🧠 Token Attributions:")
    for token, score in adjusted_scores:
        if abs(score) > 0.01:
            print(f"{token}: {score:.4f}")

    return adjusted_scores  

def generate_bot_reply(user_question: str, context: str) -> str:
    prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a compassionate mental health counselor. Your role is to:
1. Ask relevant follow-up questions
2. Provide evidence-based advice
3. Suggest coping strategies
4. Maintain professional but warm tone

Current conversation:
{context}<|eot_id|><|start_header_id|>user<|end_header_id|>
{user_question}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

    response = generator(
        prompt,
        max_new_tokens=300,
        temperature=0.7,
        top_p=0.9
    )[0]["generated_text"]

    return response.split("<|start_header_id|>assistant<|end_header_id|>")[-1].strip()


# Endpoint for text generation
@app.post("/generate")
async def generate_text(request: PredictionRequest):
    try:
        # print(request.prompt)
        generated_text = generate_bot_reply(request.prompt, request.context)
            
        return {"generated_text": generated_text}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/explain")
async def explain(request: ExplainRequest):
    try:

        generated_text = explain_response(request.userInput, request.content)   
            
        return {"generated_text": generated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("Starting server...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)