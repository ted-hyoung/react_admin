// base
import React, { useState, useEffect } from 'react';

// modules
import { Upload, Icon, message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

// components
import Spinner from '../Spinner';

// libs
import { uploadImage } from 'lib/protocols';
import { getThumbUrl } from 'lib/utils';

// types
import { FileObject } from 'models/FileObject';

// defeins
const MB = 1048576;

const defaultOptions = {
  fileListLimit: 5,
  fileSize: 5,
  accept: 'image/*',
};

interface ImageUploadOptions {
  fileListLimit?: number;
  fileSize?: number;
  accept?: string;
}

interface Props {
  value?: FileObject[];
  onChange?: (value: FileObject[]) => void;
  options?: ImageUploadOptions;
  disabled?: boolean;
}

const ImageUpload = React.forwardRef<Upload, Props>((props, ref) => {
  const { value = [], onChange, options = defaultOptions, disabled = false } = props;
  const { fileListLimit = 5, fileSize = 5, accept = 'image/*' } = options;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [inProgress, setInProgress] = useState(false);

  const handleChange = async (info: UploadChangeParam) => {
    const { file, fileList } = info;

    if (file.uid === fileList[fileList.length - 1].uid) {
      if (fileList.length > fileListLimit) {
        message.error(`이미지는 최대 ${fileListLimit}개까지만 등록 가능합니다.`);
        return false;
      }

      for (const file of fileList) {
        if (file.size > fileSize * MB) {
          message.error(`파일 사이즈가 ${fileSize}MB 보다 큽니다.`);
          return false;
        }
      }

      const startIndex = value.length > 0 ? fileList.length - value.length : 0;

      const originFileList = fileList.slice(startIndex).map(file => file.originFileObj as File);

      try {
        setInProgress(true);

        const res = await uploadImage(originFileList);

        if (onChange) {
          onChange(value.concat(res.data));
        }

        setInProgress(false);
      } catch (error) {
        message.error('이미지 등록에 실패했습니다.');
      }
    }
  };

  const handleRemove = (file: UploadFile) => {
    const fileList = value.filter(f => f.fileKey !== file.uid);

    if (onChange) {
      onChange(fileList);
    }

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
      value.map<UploadFile>(fileObject => ({
        uid: fileObject.fileKey,
        name: fileObject.fileName,
        url: getThumbUrl(fileObject.fileKey),
        size: fileObject.fileMetadata.contentLength,
        type: fileObject.fileMetadata.contentType,
      })),
    );
  }, [value]);

  return (
    <div className="image-upload">
      <Upload
        ref={ref}
        multiple
        listType="picture-card"
        accept="image/*"
        fileList={fileList}
        showUploadList={{ showPreviewIcon: false }}
        beforeUpload={() => false}
        onChange={handleChange}
        onRemove={handleRemove}
        disabled={disabled}
      >
        {fileList.length >= fileListLimit ? null : uploadButton}
      </Upload>
      {inProgress && <Spinner />}
    </div>
  );
});

export default ImageUpload;
