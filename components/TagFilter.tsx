import React from 'react';
import { Tag } from '../types';
import TagPill from './TagPill';

interface TagFilterProps {
    allTags: Tag[];
    selectedTags: string[];
    onToggleTag: (tagName: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ allTags, selectedTags, onToggleTag }) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {allTags.length > 0 ? (
                allTags.map(tag => (
                    <TagPill
                        key={tag.name}
                        name={tag.name}
                        color={tag.color}
                        onClick={() => onToggleTag(tag.name)}
                        isActive={selectedTags.includes(tag.name)}
                    />
                ))
            ) : (
                <p className="text-slate-500 italic text-sm">No tags available. Add some in 'Manage Tags'.</p>
            )}
        </div>
    );
};

export default TagFilter;
