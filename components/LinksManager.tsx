"use client";

import { useState } from "react";
import { Link as LinkType } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { generateId } from "@/lib/utils";

interface LinksManagerProps {
  links: LinkType[];
  onAdd: (link: LinkType) => void;
  onRemove: (linkId: string) => void;
  disabled?: boolean;
}

export function LinksManager({
  links,
  onAdd,
  onRemove,
  disabled = false,
}: LinksManagerProps) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (label.trim() && url.trim()) {
      onAdd({
        id: generateId(),
        label: label.trim(),
        url: url.trim(),
      });
      setLabel("");
      setUrl("");
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Evidence Links</h3>
      
      {/* Existing links */}
      <div className="space-y-2 mb-4">
        {links.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No links added yet. Add evidence links for your completed tasks.
          </p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <ExternalLink size={16} className="text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {link.label}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline truncate block"
                >
                  {link.url}
                </a>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(link.id)}
                disabled={disabled}
                className="flex-shrink-0"
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add new link form */}
      <div className="space-y-2">
        <Input
          placeholder="Link label (e.g., 'Demo Video')"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={disabled}
        />
        <Input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={disabled}
        />
        <Button
          onClick={handleAdd}
          disabled={disabled || !label.trim() || !url.trim()}
          className="w-full"
          variant="outline"
        >
          <Plus size={16} className="mr-2" />
          Add Link
        </Button>
      </div>
    </div>
  );
}

