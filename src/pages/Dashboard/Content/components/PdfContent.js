import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './PdfContent.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

class PdfContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
            pdfError: null,

            // Medidas disponibles
            containerWidth: 320,
            containerHeight: 500,

            // Medidas reales de la página PDF (px) a scale=1
            pageOriginalWidth: null,
            pageOriginalHeight: null,

            isPageRendering: false,
            fixedPageHeight: null,
        };

        this.containerRef = React.createRef();
        this.rafId = null;
    }

    componentDidMount() {
        this.updateContainerSize();
        window.addEventListener('resize', this.updateContainerSize);
        window.addEventListener('orientationchange', this.updateContainerSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContainerSize);
        window.removeEventListener('orientationchange', this.updateContainerSize);
        if (this.rafId) cancelAnimationFrame(this.rafId);
    }

    updateContainerSize = () => {
        if (this.rafId) cancelAnimationFrame(this.rafId);

        this.rafId = requestAnimationFrame(() => {
            const el = this.containerRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();

            // padding del contenedor (para width útil)
            const cs = window.getComputedStyle(el);
            const pl = parseFloat(cs.paddingLeft) || 0;
            const pr = parseFloat(cs.paddingRight) || 0;
            const pt = parseFloat(cs.paddingTop) || 0;
            const pb = parseFloat(cs.paddingBottom) || 0;

            // “seguro” contra sub-píxeles
            const safety = 8;

            const usableWidth = Math.max(240, Math.floor(rect.width - pl - pr - safety));
            const usableHeight = Math.max(300, Math.floor(rect.height - pt - pb - safety));

            this.setState({
                containerWidth: usableWidth,
                containerHeight: usableHeight,
            });
        });
    };

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages, pdfError: null }, () => {
            this.updateContainerSize();
        });
    };

    onDocumentLoadError = (error) => {
        console.error('PDF Error:', error);
        this.setState({ pdfError: error.message });
    };

    // Se dispara cuando Page conoce el tamaño real
    onPageLoadSuccess = (page) => {
        // page.originalWidth / originalHeight
        // Guardar una sola vez o cuando cambie de PDF
        const ow = page?.originalWidth;
        const oh = page?.originalHeight;

        if (
            ow &&
            oh &&
            (ow !== this.state.pageOriginalWidth || oh !== this.state.pageOriginalHeight)
        ) {
            this.setState(
                { pageOriginalWidth: ow, pageOriginalHeight: oh },
                () => this.updateContainerSize()
            );
        }
    };

    goToPreviousPage = () => {
        this.setState((prev) => ({ pageNumber: Math.max(prev.pageNumber - 1, 1) }));
    };

    goToNextPage = () => {
        this.setState((prev) => ({
            pageNumber: Math.min(prev.pageNumber + 1, prev.numPages || 1),
        }));
    };

    getScaleToFit = () => {
        const { containerWidth, containerHeight, pageOriginalWidth, pageOriginalHeight } = this.state;

        if (!pageOriginalWidth || !pageOriginalHeight) return 1;

        // El alto disponible real para la página = alto total - barra de controles
        const controlsHeight = 64; // aproximado (CSS)
        const availableHeight = Math.max(200, containerHeight - controlsHeight);

        const scaleX = containerWidth / pageOriginalWidth;
        const scaleY = availableHeight / pageOriginalHeight;

        // “contain”: que quepa completo (sin cortar)
        const scale = Math.min(scaleX, scaleY);

        // límites para que no se vea microscópico ni gigante
        return Math.max(0.45, Math.min(scale, 1.4));
    };

    render() {
        const file = this.props?.content?.file;
        const scale = this.getScaleToFit();

        return (
            <div className={styles.container} ref={this.containerRef}>
                {this.state.pdfError ? (
                    <div className={styles.error}>
                        <div className={styles.errorText}>{this.state.pdfError}</div>
                        {file ? (
                            <a href={file} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                                Abrir PDF
                            </a>
                        ) : null}
                    </div>
                ) : file ? (
                    <div className={styles.pdfWrapper}>
                        {this.state.numPages ? (
                            <div className={styles.controls}>
                                <button className={styles.btn} onClick={this.goToPreviousPage} disabled={this.state.pageNumber <= 1}>
                                    ← Anterior
                                </button>

                                <span className={styles.pageInfo}>
                                    {this.state.pageNumber} / {this.state.numPages}
                                </span>

                                <button className={styles.btn} onClick={this.goToNextPage} disabled={this.state.pageNumber >= this.state.numPages}>
                                    Siguiente →
                                </button>
                            </div>
                        ) : null}

                        <div className={styles.pdfContainer}>
                            <Document
                                file={file}
                                onLoadSuccess={this.onDocumentLoadSuccess}
                                onLoadError={this.onDocumentLoadError}
                                loading={<div className={styles.loading}>Cargando PDF...</div>}
                            >
                                <Page
                                    pageNumber={this.state.pageNumber}
                                    scale={scale}                 // ← FIT por ancho y alto
                                    onLoadSuccess={this.onPageLoadSuccess}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </div>
                    </div>
                ) : (
                    <div className={styles.noFile}>PDF no disponible</div>
                )}
            </div>
        );
    }
}

export default PdfContent;
