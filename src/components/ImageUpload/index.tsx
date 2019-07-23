// base
import React, { useState, useEffect } from 'react';

// modules
import { Upload, Icon, message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

// libs
import { uploadImage } from 'lib/protocols';
import { getThumbUrl } from 'lib/utils';

// types
import { FileObject } from 'types/FileObject';

interface Props {
  fileObjectList: FileObject[];
  setFileObjectList: React.Dispatch<React.SetStateAction<FileObject[]>>;
}

const ImageUpload = React.forwardRef<Upload, Props>((props, ref) => {
  const { fileObjectList = [], setFileObjectList } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = () => false;

  const handleChange = async (info: UploadChangeParam) => {
    const { file, fileList } = info;

    if (file.uid === fileList[fileList.length - 1].uid) {
      if (fileList.length > 5) {
        message.error('이미지는 최대 5개까지만 등록 가능합니다.');
        return false;
      }

      const startIndex = fileObjectList.length > 0 ? fileList.length - fileObjectList.length : 0;

      const originFileList = fileList.slice(startIndex).map(file => file.originFileObj as File);

      try {
        const res = await uploadImage(originFileList);

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
    <Upload
      ref={ref}
      multiple
      className="image-upload"
      listType="picture-card"
      accept="image/*"
      fileList={fileList}
      showUploadList={{ showPreviewIcon: false }}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      onRemove={handleRemove}
    >
      {fileList.length >= 5 ? null : uploadButton}
    </Upload>
  );
});

export default ImageUpload;
