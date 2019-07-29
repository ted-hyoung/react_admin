// base
import React, { useState, useEffect } from 'react';

// modules
import { Upload, Icon, message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile, UploadProps } from 'antd/lib/upload/interface';

// components
import Spinner from '../Spinner';

// libs
import { uploadImage } from 'lib/protocols';
import { getThumbUrl } from 'lib/utils';

// types
import { FileObject } from 'types/FileObject';

// defeins
const MB = 1048576;
const defaultOptions = {
  limit: 5,
  size: 5,
};

interface ImageUploadOptions {
  limit?: number;
  size?: number;
}

interface Props extends UploadProps {
  fileObjectList: FileObject[];
  setFileObjectList: React.Dispatch<React.SetStateAction<FileObject[]>>;
  options?: ImageUploadOptions;
  disabled?: boolean;
}

const ImageUpload = React.forwardRef<Upload, Props>((props, ref) => {
  const { fileObjectList = [], setFileObjectList, options = defaultOptions, disabled = false } = props;
  const { limit = 5, size = 5 } = options;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [inProgress, setInProgress] = useState(false);

  const beforeUpload = () => false;

  const handleChange = async (info: UploadChangeParam) => {
    const { file, fileList } = info;

    if (file.uid === fileList[fileList.length - 1].uid) {
      if (fileList.length > limit) {
        message.error(`이미지는 최대 ${limit}개까지만 등록 가능합니다.`);
        return false;
      }

      for (const file of fileList) {
        if (file.size > size * MB) {
          message.error(`파일 사이즈가 ${size}MB 보다 큽니다.`);
          return false;
        }
      }

      const startIndex = fileObjectList.length > 0 ? fileList.length - fileObjectList.length : 0;

      const originFileList = fileList.slice(startIndex).map(file => file.originFileObj as File);

      try {
        setInProgress(true);

        const res = await uploadImage(originFileList);

        setInProgress(false);
        setFileObjectList(fileObjectList.concat(res.data));
      } catch (error) {
        message.error('이미지 등록에 실패했습니다.');
      }
    }
  };

  const handleRemove = (file: UploadFile) => {
    const currentFileObjectList = fileObjectList.filter(f => f.fileKey !== file.uid);

    setFileObjectList(currentFileObjectList);

    return false;
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  useEffect(() => {
    setFileList(
      fileObjectList.map<UploadFile>(fileObject => ({
        uid: fileObject.fileKey,
        name: fileObject.fileName,
        url: getThumbUrl(fileObject.fileKey),
        size: fileObject.fileMetadata.contentLength,
        type: fileObject.fileMetadata.contentType,
      })),
    );
  }, [fileObjectList]);

  return (
    <div className="image-upload">
      <Upload
        ref={ref}
        multiple
        listType="picture-card"
        accept="image/*"
        fileList={fileList}
        showUploadList={{ showPreviewIcon: false }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={handleRemove}
        disabled={disabled}
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>
      {inProgress && <Spinner />}
    </div>
  );
});

export default ImageUpload;
