import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Zoom, Navigation, Pagination } from 'swiper';
import ImgsViewer from 'react-images-viewer';
import AudioPlayer from 'react-h5-audio-player';
import './style.css';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'react-h5-audio-player/lib/styles.css';
SwiperCore.use([Zoom, Navigation, Pagination]);

function ShowDocumentFile(props) {
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [imageFiles, setImageFiles] = useState([]);

    const document = props?.document;
    useEffect(() => {
        if (document?.fileType === 'image') {
            let tmpImageFiles = [];

            for (let file of document?.files) {
                tmpImageFiles.push({
                    src: file,
                    width: 200,
                    height: 200,
                });
            }
            setImageFiles(tmpImageFiles);
        }
    }, [document]);

    const clickNextViewerImage = () => {
        let tmpImg = currentImage;
        tmpImg++;
        setCurrentImage(tmpImg);
    };

    const clickPreviousViewerImage = () => {
        let tmpImg = currentImage;
        tmpImg--;
        setCurrentImage(tmpImg);
    };

    const getFilesData = (fileType) => {
        switch (fileType) {
            case 'image':
                return (
                    <div
                        className='imageFile'
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {document?.files.length > 1 ? (
                            <div>
                                <Swiper
                                    className='swiper'
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    // zoom={true}
                                    navigation={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                >
                                    {document?.files.map((file, index) => (
                                        <SwiperSlide
                                            className='swiperSlide'
                                            key={index}
                                            onClick={() => {
                                                setIsImageViewerOpen(true);
                                                setCurrentImage(index);
                                            }}
                                        >
                                            <div className='swiper-zoom-container'>
                                                <img
                                                    // key={index}
                                                    src={file}
                                                    alt='Dokument slika'
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <ImgsViewer
                                    imgs={imageFiles}
                                    isOpen={isImageViewerOpen}
                                    onClose={() => setIsImageViewerOpen(false)}
                                    width={1500}
                                    currImg={currentImage}
                                    onClickPrev={clickPreviousViewerImage}
                                    onClickNext={clickNextViewerImage}
                                    spinnerDisabled
                                    backdropCloseable
                                />
                            </div>
                        ) : (
                            <div className='imageFile'>
                                <img
                                    src={document?.files[0]}
                                    // src={`data:image/jpeg;base64, ${document?.files[0]}`}
                                    alt='Dokument slika'
                                    onClick={() => setIsImageViewerOpen(true)}
                                    // onContextMenu={return false}
                                    // style={{
                                    //     filter: isDocPrivate && 'blur(1.5rem)',
                                    //     // visibility: 'hidden',
                                    // }}
                                />
                                <ImgsViewer
                                    imgs={[{ src: document?.files[0] }]}
                                    isOpen={isImageViewerOpen}
                                    onClose={() => setIsImageViewerOpen(false)}
                                    width={1500}
                                    spinnerDisabled
                                    backdropCloseable
                                    onClickImg={(e) => e.preventDefault()}
                                />
                            </div>
                        )}
                    </div>
                );
            case 'video':
                return (
                    <div className='videoFile'>
                        <video
                            src={document?.files[0]}
                            // src={`data:video/mp4;base64, ${document?.files[0]}`}
                            controls
                            controlsList='nodownload'
                        />
                    </div>
                );
            case 'audio':
                return (
                    <AudioPlayer
                        src={document?.files[0]}
                        customAdditionalControls={[]}
                        className='audioFile'
                        // controls
                        // controlsList='nodownload'
                    />
                );
            case 'document':
                return (
                    <iframe
                        sandbox='allow-scripts allow-same-origin'
                        title={document?.documentName}
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            document?.files[0]
                        )}&embedded=true`}
                        frameBorder='0'
                        width='100%'
                        className='docFile'
                        allowFullScreen
                        onContextMenu={(e) => e.preventDefault()}
                    />
                );
            default:
                break;
        }
    };
    return (
        <div className='documentFile'>{getFilesData(document?.fileType)}</div>
    );
}

export default ShowDocumentFile;
