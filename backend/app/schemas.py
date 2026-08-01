from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Common Base
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Agent Schemas
class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    model: str = "gpt-4o"
    project_id: str

class AgentCreate(AgentBase):
    pass

class AgentResponse(AgentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Prompt Version Schemas
class PromptVersionBase(BaseModel):
    content: str
    commit_message: Optional[str] = None

class PromptVersionCreate(PromptVersionBase):
    pass

class PromptVersionResponse(PromptVersionBase):
    id: str
    prompt_template_id: str
    version_number: int
    created_at: datetime

    class Config:
        from_attributes = True

# Prompt Template Schemas
class PromptTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    project_id: str

class PromptTemplateCreate(PromptTemplateBase):
    # When creating a template, we also create the first version
    initial_content: str

class PromptTemplateResponse(PromptTemplateBase):
    id: str
    created_at: datetime
    # We might want to include versions, but let's keep it simple for now
    versions: List[PromptVersionResponse] = []

    class Config:
        from_attributes = True

# Workflow Schemas
class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    project_id: str

class WorkflowCreate(WorkflowBase):
    flow_data: Optional[dict] = {}

class WorkflowUpdate(BaseModel):
    flow_data: dict

class WorkflowResponse(WorkflowBase):
    id: str
    flow_data: Optional[dict] = {}
    created_at: datetime

    class Config:
        from_attributes = True

# Document Schemas
class DocumentBase(BaseModel):
    name: str
    content: str
    project_id: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# User Schemas
class UserResponse(BaseModel):
    id: str
    name: Optional[str]
    org_name: Optional[str]
    email: str
    image: Optional[str]
    api_keys: Optional[List[dict]] = []

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str]
    org_name: Optional[str]
    api_keys: Optional[List[dict]] = []

# UsageLog Schemas
class UsageLogResponse(BaseModel):
    id: str
    project_id: str
    agent_id: Optional[str]
    tokens_used: int
    cost: str
    created_at: datetime

    class Config:
        from_attributes = True

# MarketplaceItem Schemas
class MarketplaceItemResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    item_type: str
    price: str
    author: str
    downloads: int
    config_data: dict
    created_at: datetime

    class Config:
        from_attributes = True
