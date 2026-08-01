from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import get_db

router = APIRouter()

# Projects
@router.post("/projects", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    # Mocking owner_id for MVP since auth token parsing isn't hooked up yet
    mock_owner_id = "mock-user-123"
    
    # Ensure mock user exists
    user = db.query(models.User).filter(models.User.id == mock_owner_id).first()
    if not user:
        user = models.User(id=mock_owner_id, email="demo@promptimagelab.com", name="Demo User")
        db.add(user)
        db.commit()

    db_project = models.Project(**project.model_dump(), owner_id=mock_owner_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/projects", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    # Mock auth filter
    mock_owner_id = "mock-user-123"
    return db.query(models.Project).filter(models.Project.owner_id == mock_owner_id).all()

# Agents
@router.post("/agents", response_model=schemas.AgentResponse)
def create_agent(agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    # Verify project exists
    project = db.query(models.Project).filter(models.Project.id == agent.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_agent = models.Agent(**agent.model_dump())
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@router.get("/agents", response_model=List[schemas.AgentResponse])
def get_agents(project_id: str, db: Session = Depends(get_db)):
    return db.query(models.Agent).filter(models.Agent.project_id == project_id).all()

# Prompts
@router.post("/prompts", response_model=schemas.PromptTemplateResponse)
def create_prompt(prompt: schemas.PromptTemplateCreate, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == prompt.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Create Template
    db_template = models.PromptTemplate(
        name=prompt.name, 
        description=prompt.description, 
        project_id=prompt.project_id
    )
    db.add(db_template)
    db.flush() # Get ID without committing

    # Create Version 1
    db_version = models.PromptVersion(
        prompt_template_id=db_template.id,
        version_number=1,
        content=prompt.initial_content,
        commit_message="Initial commit"
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.get("/prompts", response_model=List[schemas.PromptTemplateResponse])
def get_prompts(project_id: str, db: Session = Depends(get_db)):
    return db.query(models.PromptTemplate).filter(models.PromptTemplate.project_id == project_id).all()

@router.post("/prompts/{template_id}/versions", response_model=schemas.PromptVersionResponse)
def create_prompt_version(template_id: str, version: schemas.PromptVersionCreate, db: Session = Depends(get_db)):
    template = db.query(models.PromptTemplate).filter(models.PromptTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Prompt template not found")

    # Get latest version number
    latest_version = db.query(models.PromptVersion)\
        .filter(models.PromptVersion.prompt_template_id == template_id)\
        .order_by(models.PromptVersion.version_number.desc()).first()
    
    next_version = (latest_version.version_number + 1) if latest_version else 1

    db_version = models.PromptVersion(
        prompt_template_id=template_id,
        version_number=next_version,
        content=version.content,
        commit_message=version.commit_message or f"Update to v{next_version}"
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version

@router.get("/prompts/{template_id}/versions", response_model=List[schemas.PromptVersionResponse])
def get_prompt_versions(template_id: str, db: Session = Depends(get_db)):
    return db.query(models.PromptVersion)\
        .filter(models.PromptVersion.prompt_template_id == template_id)\
        .order_by(models.PromptVersion.version_number.desc())\
        .all()

# Workflows
@router.post("/workflows", response_model=schemas.WorkflowResponse)
def create_workflow(workflow: schemas.WorkflowCreate, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == workflow.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_workflow = models.Workflow(**workflow.model_dump())
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

@router.get("/workflows", response_model=List[schemas.WorkflowResponse])
def get_workflows(project_id: str, db: Session = Depends(get_db)):
    return db.query(models.Workflow).filter(models.Workflow.project_id == project_id).all()

@router.put("/workflows/{workflow_id}", response_model=schemas.WorkflowResponse)
def update_workflow_canvas(workflow_id: str, update: schemas.WorkflowUpdate, db: Session = Depends(get_db)):
    db_workflow = db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db_workflow.flow_data = update.flow_data
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

# Documents (Knowledge Base)
@router.post("/documents", response_model=schemas.DocumentResponse)
def create_document(doc: schemas.DocumentCreate, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == doc.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_doc = models.Document(**doc.model_dump())
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.get("/documents", response_model=List[schemas.DocumentResponse])
def get_documents(project_id: str, db: Session = Depends(get_db)):
    return db.query(models.Document).filter(models.Document.project_id == project_id).all()

# Mocked Playground Chat
from pydantic import BaseModel as PydanticBaseModel

class ChatRequest(PydanticBaseModel):
    agent_id: str
    message: str

@router.post("/chat")
def chat_with_agent(req: ChatRequest, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == req.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Mocking LLM Response
    return {
        "reply": f"Hello! I am {agent.name}, running on {agent.model}. You said: '{req.message}'. (This is a mocked MVP response)."
    }

# Mocked Workflow Execution
@router.post("/workflows/{workflow_id}/run")
def run_workflow(workflow_id: str, db: Session = Depends(get_db)):
    db_workflow = db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Simulate execution logs based on nodes in flow_data
    flow_data = db_workflow.flow_data or {}
    nodes = flow_data.get("nodes", [])
    
    logs = [f"Starting execution of workflow '{db_workflow.name}'..."]
    for node in nodes:
        node_type = node.get("type", "Unknown")
        label = node.get("data", {}).get("label", "Node")
        logs.append(f"Executing [ {node_type} ]: {label}")
    
    logs.append("Workflow execution completed successfully.")
    
    return {"status": "success", "logs": logs}


# User
@router.get("/user/me", response_model=schemas.UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    mock_owner_id = "mock-user-123"
    user = db.query(models.User).filter(models.User.id == mock_owner_id).first()
    if not user:
        user = models.User(id=mock_owner_id, email="demo@promptimagelab.com", name="Demo User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.put("/user/settings", response_model=schemas.UserResponse)
def update_user_settings(settings: schemas.UserUpdate, db: Session = Depends(get_db)):
    mock_owner_id = "mock-user-123"
    user = db.query(models.User).filter(models.User.id == mock_owner_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if settings.name is not None:
        user.name = settings.name
    if settings.org_name is not None:
        user.org_name = settings.org_name
    if settings.api_keys is not None:
        user.api_keys = settings.api_keys
        
    db.commit()
    db.refresh(user)
    return user

# Analytics
@router.get("/analytics", response_model=List[schemas.UsageLogResponse])
def get_analytics(project_id: str, db: Session = Depends(get_db)):
    return db.query(models.UsageLog).filter(models.UsageLog.project_id == project_id).all()

# Marketplace
@router.get("/marketplace", response_model=List[schemas.MarketplaceItemResponse])
def get_marketplace_items(db: Session = Depends(get_db)):
    return db.query(models.MarketplaceItem).all()

@router.post("/marketplace/{item_id}/install")
def install_marketplace_item(item_id: str, project_id: str, db: Session = Depends(get_db)):
    item = db.query(models.MarketplaceItem).filter(models.MarketplaceItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if item.item_type == "agent":
        new_agent = models.Agent(
            name=item.name,
            description=item.description,
            system_prompt=item.config_data.get("system_prompt", ""),
            model=item.config_data.get("model", "gpt-4o"),
            project_id=project_id
        )
        db.add(new_agent)
    elif item.item_type == "prompt":
        new_template = models.PromptTemplate(
            name=item.name,
            description=item.description,
            project_id=project_id
        )
        db.add(new_template)
        db.flush()
        new_version = models.PromptVersion(
            prompt_template_id=new_template.id,
            version_number=1,
            content=item.config_data.get("content", ""),
            commit_message="Installed from marketplace"
        )
        db.add(new_version)
    elif item.item_type == "workflow":
        new_workflow = models.Workflow(
            name=item.name,
            description=item.description,
            project_id=project_id,
            flow_data=item.config_data.get("flow_data", {})
        )
        db.add(new_workflow)
    
    item.downloads += 1
    db.commit()
    return {"status": "success", "message": f"Installed {item.name} to project {project_id}"}
