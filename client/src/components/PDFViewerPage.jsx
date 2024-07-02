import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PDFViewer from './PDFViewer';

const PDFViewerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pdfBlob } = location.state || {}; // Usa un objeto vacío como valor predeterminado

    if (!pdfBlob) {
        return <div>No PDF provided</div>;
    }

    return (
        <div style={{width: '100vw'}}>
            <button className='btn btn-success m-4' onClick={e => navigate('/')}>Regresar</button>
            <PDFViewer pdfBlob={pdfBlob} />
        </div>
    );
};

export default PDFViewerPage;
