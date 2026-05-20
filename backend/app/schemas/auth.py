from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

class UserInfo(BaseModel):
    id: str
    email: str
    name: str
    role: str

class LoginResponse(BaseModel):
    accessToken: str
    refreshToken: str
    expiresIn: int
    user: UserInfo

class LogoutRequest(BaseModel):
    refreshToken: str

class RefreshRequest(BaseModel):
    refresh_token: str

class RefreshResponse(BaseModel):
    accessToken: str
    expiresIn: int

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class MessageResponse(BaseModel):
    message: str