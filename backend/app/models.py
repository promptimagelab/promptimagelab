from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from sqlalchemy import JSON

from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=True)
    org_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    image = Column(String, nullable=True)
    api_keys = Column(JSON, nullable=True, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    projects = relationship("Project", back_populates="owner")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="projects")
    agents = relationship("Agent", back_populates="project", cascade="all, delete-orphan")
    prompt_templates = relationship("PromptTemplate", back_populates="project", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="project", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")


class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    system_prompt = Column(Text, nullable=True)
    model = Column(String, nullable=False, default="gpt-4o")
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="agents")


class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="prompt_templates")
    versions = relationship("PromptVersion", back_populates="template", cascade="all, delete-orphan", order_by="desc(PromptVersion.version_number)")


class PromptVersion(Base):
    __tablename__ = "prompt_versions"

    id = Column(String, primary_key=True, default=generate_uuid)
    prompt_template_id = Column(String, ForeignKey("prompt_templates.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    commit_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    template = relationship("PromptTemplate", back_populates="versions")


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    # Using JSON type for storing react-flow nodes and edges
    flow_data = Column(JSON, nullable=True, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="workflows")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="documents")


class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    agent_id = Column(String, ForeignKey("agents.id", ondelete="SET NULL"), nullable=True)
    tokens_used = Column(Integer, nullable=False, default=0)
    cost = Column(String, nullable=False, default="0.00") # string for decimal precision in sqlite MVP
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project")


class MarketplaceItem(Base):
    __tablename__ = "marketplace_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    item_type = Column(String, nullable=False) # 'agent', 'prompt', 'workflow'
    price = Column(String, nullable=False, default="0.00")
    author = Column(String, nullable=False)
    downloads = Column(Integer, default=0)
    config_data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    latency_ms = Column(Integer, nullable=False, default=0)
    redacted = Column(Integer, nullable=False, default=0) # SQLite doesn't natively support bool, use 1 or 0
    stream = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
