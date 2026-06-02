from pydantic import BaseModel, EmailStr, Field

<<<<<<< HEAD
=======
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2, max_length=120)

>>>>>>> 298ebad (Actualizacion de datos)
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
<<<<<<< HEAD
=======
    refreshToken: str | None = None
>>>>>>> 298ebad (Actualizacion de datos)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class MessageResponse(BaseModel):
<<<<<<< HEAD
    message: str
=======
    message: str
>>>>>>> 298ebad (Actualizacion de datos)
