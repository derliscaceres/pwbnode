import React, { useEffect, useState } from 'react';

const PDFViewer = ({ pdfBlob }) => {
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);

        // Limpia el objeto URL cuando el componente se desmonte
        return () => URL.revokeObjectURL(url);
    }, [pdfBlob]);

    return (
        <div>
            {pdfUrl ? (
                <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
            ) : (
                <p>Loading PDF...</p>
            )}
        </div>
    );
};

export default PDFViewer;
