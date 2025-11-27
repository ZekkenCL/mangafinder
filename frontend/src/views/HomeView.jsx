import React from 'react';
import DropZone from '../components/DropZone';
import History from '../components/History';
import ImagePreview from '../components/ImagePreview';

const HomeView = ({
    isLoading,
    selectedFile,
    previewUrl,
    showCropper,
    language,
    history,
    onFileSelected,
    onSearch,
    onCrop,
    onCancelSelection,
    onSelectMatch,
    onClearHistory,
    onRemoveHistory
}) => {
    if (selectedFile && !showCropper) {
        return (
            <ImagePreview
                imageSrc={previewUrl}
                onSearch={onSearch}
                onCrop={onCrop}
                onCancel={onCancelSelection}
            />
        );
    }

    return (
        <>
            <DropZone
                onFileSelected={onFileSelected}
                isLoading={isLoading}
                language={language}
            />
            <History
                history={history}
                onSelect={onSelectMatch}
                language={language}
                onClear={onClearHistory}
                onRemove={onRemoveHistory}
            />
        </>
    );
};

export default HomeView;
