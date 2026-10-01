from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from groq import Groq
from backend.config import settings
import logging

router = APIRouter(tags=["Copilot"])
log = logging.getLogger("satquery")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    aoi: dict = None


@router.post("/chat")
async def chat_copilot(req: ChatRequest):
    if not settings.gemini_api_key:
        return {"response": "SYSTEM: Assistant Copilot requires GEMINI_API_KEY to be set in the environment variables."}
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.gemini_api_key)
        
        system_content = "You are an advanced geospatial AI analyst. Provide concise, highly accurate answers."
        if req.aoi:
            system_content = f"""You are an expert geospatial AI analyst.
USER QUESTION IS ABOUT THIS SPECIFIC GEOGRAPHIC REGION:
SELECTED AOI (GeoJSON): {req.aoi.get('geojson')}
CENTER: {req.aoi.get('centerLat')}, {req.aoi.get('centerLng')}
BOUNDS: {req.aoi.get('south')} to {req.aoi.get('north')} Lat, {req.aoi.get('west')} to {req.aoi.get('east')} Lng
AREA: {req.aoi.get('areaKm2')} km2
CRS: EPSG:4326

The AI must not invent satellite observations. If actual imagery/analysis is unavailable, explicitly state that the available data is insufficient instead of claiming that it detected something."""

        # Convert history to Gemini format
        formatted_messages = []
        for msg in req.messages:
            role = 'model' if msg.role == 'assistant' else 'user'
            formatted_messages.append({
                "role": role,
                "parts": [msg.content]
            })
            
        model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_content)
        response = model.generate_content(formatted_messages)
        
        return {"response": response.text}
    except Exception as e:
        log.exception("Chat Copilot error (Gemini)")
        return {"response": f"Error: {str(e)}"}
