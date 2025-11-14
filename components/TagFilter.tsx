import React from 'react';
import { Tag } from '../types';
import TagPill from './TagPill';

/**
 * Props for the TagFilter component.
 */
interface TagFilterProps {
    /** The list of all available tags. */
    allTags: Tag[];
    /** An array of the names of the currently selected tags. */
    selectedTags: string[];
    /** Callback function to toggle the selection of a tag. */
    onToggleTag: (tagName: string) => void;
}

/**
 * A component that displays a list of available tags for filtering.
 * Users can click on tags to toggle them as active filters.
 * @param {TagFilterProps} props The component props.
 * @returns {JSX.Element} The rendered tag filter component.
 */
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
