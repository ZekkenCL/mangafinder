import React from 'react';
import ResultCard from '../components/ResultCard';
import DetailsCard from '../components/DetailsCard';
import AuthorCard from '../components/AuthorCard';
import RelatedWorksCard from '../components/RelatedWorksCard';
import SourcesCard from '../components/SourcesCard';
import OtherMatches from '../components/OtherMatches';

const ResultsView = ({
    result,
    language,
    previewUrl,
    onReset,
    onSelectMatch
}) => {
    return (
        <>
            <ResultCard
                result={result}
                onReset={onReset}
                language={language}
                previewUrl={previewUrl}
            />

            <DetailsCard
                result={result}
                language={language}
            />

            {result.autores && (
                <AuthorCard
                    authors={result.autores}
                    language={language}
                />
            )}

            {result.otras_obras && result.autores && result.autores.length > 0 && (
                <RelatedWorksCard
                    works={result.otras_obras}
                    authorName={result.autores[0].name}
                    language={language}
                />
            )}

            <SourcesCard
                result={result}
                language={language}
            />

            {result.otras_coincidencias && (
                <OtherMatches
                    matches={result.otras_coincidencias}
                    language={language}
                    onSelect={onSelectMatch}
                />
            )}
        </>
    );
};

export default ResultsView;
