import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import {
    AddCircleOutlineOutlined,
    DeleteOutline,
    Cancel,
    Add,
} from '@mui/icons-material';
import './style.css';

function UploadBox(props) {
    const [files, setFiles] = useState(props?.document.files);

    const document = props?.document;
    const maxDocFileSize = 25000000;
    const maxOtherFilesSize = 1000000000;
    const addImageBox = useRef(null);

    const isEditEnabled = props?.isEditEnabled;

    const changeFileTypeHandler = () => {
        switch (document?.fileType) {
            case 'image':
                return '.jpeg, .png, .jpg, .gif';
            case 'video':
                return '.mp4, .MPEG-4, .mkv, .avi, .flv, .mov';
            case 'audio':
                return '.mp3, .aac, .wav, .wma';
            case 'document':
                return '.pdf, .doc, .docx, .txt';
            default:
                break;
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: changeFileTypeHandler(),
        onDrop: (acceptedFiles) => {
            acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setFiles(acceptedFiles);
            handleEditFiles(acceptedFiles);
        },
        maxFiles: document?.fileType === 'image' ? 5 : 1,
        maxSize:
            document?.fileType === 'document'
                ? maxDocFileSize
                : maxOtherFilesSize,
        disabled: isEditEnabled ? false : true,
    });

    const removeImageFromFiles = (index) => {
        const tmpFiles = [...files.filter((_, id) => id !== index)];
        setFiles(tmpFiles);
        handleEditFiles(tmpFiles);
    };

    const addMoreImages = () => {
        if (isEditEnabled) {
            addImageBox.current.click();
        }
    };

    const addMoreFilesChangeHadler = (e) => {
        if (e.target.files.length > 0) {
            let editedImagesArr = [...files];
            const newImage = e.target.files[0];
            editedImagesArr.push(
                Object.assign(newImage, {
                    preview: URL.createObjectURL(newImage),
                })
            );
            setFiles(editedImagesArr);
            handleEditFiles(editedImagesArr);
        }
    };

    const images = files.map((file, index) => (
        <div className='imageOuter' key={index}>
            {isEditEnabled && (
                <Cancel
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        marginLeft: 80,
                        marginTop: -20,
                    }}
                    onClick={() => removeImageFromFiles(index)}
                />
            )}

            <div className='imageInner'>
                <img
                    src={file.preview ? file.preview : file}
                    className='img'
                    alt='post'
                />
            </div>
        </div>
    ));

    const handleEditFiles = (editedFiles) => {
        props.onEdit(editedFiles);
    };

    return (
        <div className='uploadBox'>
            <div
                className={isEditEnabled ? 'dragArea' : 'dragArea disabled'}
                {...getRootProps()}
            >
                <AddCircleOutlineOutlined className='icon' />
                <h3>Dodaj dokument</h3>
                <p>Povuci/izbaci</p>
                <p>Podržani fajlovi {changeFileTypeHandler()}</p>
                <p>
                    maksimalno {document?.fileType === 'image' ? 5 : 1}{' '}
                    fajl/fajlova po uploadu
                </p>
                {document?.fileType === 'document' && (
                    <p>Maksimalna veličina fajla 25MB</p>
                )}
                <input type='file' hidden {...getInputProps()} />
            </div>
            {document?.fileType === 'image' ? (
                <div className='imageContainer'>
                    {images}
                    {files.length > 0 && files.length < 5 && (
                        <div
                            className='imageOuter'
                            style={{
                                cursor: isEditEnabled
                                    ? 'pointer'
                                    : 'not-allowed',
                            }}
                            onClick={addMoreImages}
                        >
                            <input
                                type='file'
                                hidden
                                accept='image/png, image/gif, image/jpeg, image/jpg'
                                ref={addImageBox}
                                onChange={addMoreFilesChangeHadler}
                            />
                            <Add
                                style={{
                                    position: 'absolute',
                                    marginLeft: 32,
                                    marginTop: 32,
                                }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {files.map((file, index) => {
                        return (
                            <List key={index}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            edge='end'
                                            aria-label='delete'
                                            onClick={() =>
                                                removeImageFromFiles(index)
                                            }
                                            disabled={
                                                !isEditEnabled ? true : false
                                            }
                                        >
                                            <DeleteOutline />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            file.path
                                                ? file.path
                                                : document.documentName
                                        }
                                    />
                                </ListItem>
                            </List>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UploadBox;
