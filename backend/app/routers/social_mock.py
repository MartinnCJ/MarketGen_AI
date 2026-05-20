from fastapi import APIRouter

router = APIRouter(
    prefix="/settings/social",
    tags=["Social Integrations"]
)


@router.post("/{platform}/connect")
async def connect_social(platform: str):

    return {
        "platform": platform,
        "authUrl": f"https://oauth.example.com/{platform}"
    }


@router.delete("/{platform}")
async def disconnect_social(platform: str):

    return {
        "platform": platform,
        "disconnected": True
    }