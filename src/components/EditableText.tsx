"use client";

import React from "react";

interface EditableTextProps {
  id: string;
  def: string;
  content: any;
  updateField: (id: string, text: string) => void;
  isEditMode: boolean;
  className?: string;
  tag?: React.ElementType;
  styles: any;
}

export function EditableText({ 
  id, 
  def, 
  content, 
  updateField, 
  isEditMode, 
  className = "", 
  tag: Tag = "p",
  styles
}: EditableTextProps) {
  const text = content?.[id] || def;

  return (
    <Tag 
      className={`${className} ${isEditMode ? 'editable' : ""}`}
      contentEditable={isEditMode}
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const newText = e.currentTarget.textContent || "";
        if (newText !== text) {
          updateField(id, newText);
        }
      }}
    >
      {text}
    </Tag>
  );
}
