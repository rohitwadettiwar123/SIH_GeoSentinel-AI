import os
import uvicorn
import gradio as gr
from backend.main import app as fastapi_app

# Create a dummy Gradio interface just to satisfy Hugging Face's Gradio SDK requirement
demo = gr.Interface(
    fn=lambda x: "SatQuery AI Backend is running!", 
    inputs="text", 
    outputs="text",
    title="SatQuery AI",
    description="This is the backend server for GeoSentinel. The API is accessible at /api"
)

# Mount our massive FastAPI application alongside the dummy Gradio app
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

# If run directly (e.g. locally)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
