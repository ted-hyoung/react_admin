// base
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Select, Button, Rate, Divider, Switch, Row, Col, Table, Modal, message, Input } from 'antd';
import { DndProvider, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from 'react-dnd-html5-backend';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// store
import { StoreState } from 'store';

import {
  SearchBannerList,
  SelectedBanner,
  UpdateBanner,
} from '../../models';
import {
  deleteBannersAsync,
  getBannersAsync,
  getBannersMainAsync,
  updateBannersMainAsync, updateBannersMainSequenceAsync,
} from '../../store/action/banner.action';
import { PaginationTable } from '../../components';
import { getThumbUrl, setPagingIndex } from '../../lib/utils';
import {
  BannerExposeJson,
  BannerExposeStatus,
  BannerOrder,
  BannerOrderJson,
  BannerType,
  BannerTypeJson,
} from '../../enums/Banner';

import DndList from '../../components/DndList';
import DndItem from '../../components/DndList/DndItem';
import { useHistory } from 'react-router';

// components


interface BannerDetail {
  viewCnt:number;
  url:string;
  created:string;
  fileKey:string;
}

// types
interface BannerList {
  key: number;
  no: number;
  period: string;
  bannerId:number;
  bannerType:BannerType;
  bannerExposeStatus:BannerExposeStatus;
  title:string;
  viewCnt:number;
  url:string;
  created:string;
  fileKey:string;
  detail:object;
}

interface SequenceList {
  sequenceId: number;
  bannerId:number;
  id: number;
  period: string;
  bannerType: BannerType;
  bannerExposeStatus:BannerExposeStatus;
  title: string;

}

const defaultSearchCondition:SearchBannerList = {
  bannerOrder:BannerOrder[BannerOrder.CREATED_DESC]
};

function Banner() {
  const { Option } = Select;
  const dispatch = useDispatch();
  const history = useHistory();
  const { banners, bannersMain} = useSelector((state: StoreState) => state.banner);
  const { content, totalElements, size: pageSize } = banners;
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchBannerList>();
  const [selectedSeqList, setSelectedSeqList] = useState<number[] | string[]>([]);
  const [selectedBanners, setSelectedBanners] = useState<number[] | string[]>([]);
  const [bannerOrderSelected, setBannerOrderSelected] = useState<BannerOrder>(BannerOrder[BannerOrder.CREATED_DESC]);
  const [bannerTypeSelected, setBannerTypeSelected] = useState<BannerType>(BannerType[BannerType.TOTAL]);
  const [bannerExposeSelected, setBannerExposeSelected] = useState<BannerExposeStatus>(BannerExposeStatus[BannerExposeStatus.TOTAL]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showSequenceListModal, setShowSequenceListModal] = useState<boolean>(false);

  const [sequenceList, setSequenceList] = useState<SequenceList[]>([
    {
      sequenceId: 0,
      bannerId:0,
      id: 0,
      period: '공구 없음',
      bannerType: BannerType.EVENT,
      bannerExposeStatus:BannerExposeStatus.DISABLE,
      title: '공구없음'
    }
  ]);

  const getBannersMain = useCallback(
    () => {
      dispatch(getBannersMainAsync.request({}));
    },
    [dispatch, pageSize, setLastSearchCondition],
  );

  const getBanners = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchBannerList) => {
      dispatch(
        getBannersAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
      setLastSearchCondition(searchCondition);
    },
    [dispatch, pageSize, setLastSearchCondition],
  );

  useEffect(() => {
    getBannersMain();
    getBanners(0,10, defaultSearchCondition);
    return () => {
      // will unmount
    };
  }, []);

  const handleChange = useCallback(
    (selectedRowKeys: number[] | string[]) => {
      setSelectedSeqList(selectedRowKeys);
    },
    [setSelectedSeqList],
  );

  const handleChangeBanner = useCallback(
    (selectedRowKeys: number[] | string[]) => {

      setSelectedBanners(selectedRowKeys);
    },
    [setSelectedBanners],
  );

  const columns: Array<ColumnProps<BannerList>> = useMemo(
    () => [
      {
        title: 'NO',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '분류',
        dataIndex: 'bannerType',
        key: 'bannerType',
      },
      {
        title: '배너제목',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '상세정보',
        dataIndex: 'detail',
        key: 'detail',
        render: (detail) => (
          <div style={{ display: 'flex' }}>
            <div>
              {detail && (
                <>
                  <img src={getThumbUrl(detail.fileKey, 110, 110)} />
                  <br />
                </>
              )}
            </div>
            <div style={{ paddingLeft: 15 }}>
              <div style={{ paddingBottom: 10 }}>- 등록일:{detail.created}</div>
              <div style={{ paddingBottom: 10 }}>- 링크:{detail.url}</div>
              <div style={{ paddingBottom: 10 }}>- 클릭수:{detail.viewCnt}</div>
            </div>
          </div>
        ),
      },
      {
        title: '노출기간',
        dataIndex: 'period',
        key: 'period',
      },
      {
        title: '상태',
        dataIndex: 'bannerExposeStatus',
        key: 'bannerExposeStatus',
      }
    ],
    [getBanners],
  );

  const mainData: BannerList[] = bannersMain.map((banner, i) => {
    return {
      key: banner.bannerId,
      no: i+1,
      period:banner.exposeStarted! ? `${moment(banner.exposeStarted).format('YYYY-MM-DD')} ~ ${moment(banner.exposeEnded).format('YYYY-MM-DD')}` : '기간 없음',
      bannerId: banner.bannerId,
      bannerType: BannerType[banner.bannerType],
      bannerExposeStatus:BannerExposeStatus[banner.bannerExposeStatus],
      title: banner.title,
      viewCnt: banner.viewCnt,
      url: `${process.env.REACT_APP_CLIENT_URL}/${banner.url}`,
      fileKey:banner.image.fileKey,
      created: moment(banner.created).format('YYYY-MM-DD HH:mm:ss'),
      detail:{
        viewCnt: banner.viewCnt,
        url: `${process.env.REACT_APP_CLIENT_URL}/${banner.url}`,
        fileKey:banner.image.fileKey,
        created: moment(banner.created).format('YYYY-MM-DD HH:mm:ss'),
      }
    };
  });

  const seqList: SequenceList[] = bannersMain.map((banner, i) => {
    return {
      id: i+1,
      sequenceId:i+1,
      period:banner.exposeStarted! ? `${moment(banner.exposeStarted).format('YYYY-MM-DD')} ~ ${moment(banner.exposeEnded).format('YYYY-MM-DD')}` : '기간 없음',
      bannerId: banner.bannerId,
      bannerType: BannerType[banner.bannerType],
      bannerExposeStatus:BannerExposeStatus[banner.bannerExposeStatus],
      title: banner.title,
    };
  },[]);


  const data: BannerList[] = banners.content.map((banner, i) => {
    return {
      key: banner.bannerId,
      no: setPagingIndex(banners.totalElements, banners.page, banners.size, i),
      period:banner.exposeStarted! ? `${moment(banner.exposeStarted).format('YYYY-MM-DD')} ~ ${moment(banner.exposeEnded).format('YYYY-MM-DD')}` : '기간 없음',
      bannerId: banner.bannerId,
      bannerType: BannerType[banner.bannerType],
      bannerExposeStatus:BannerExposeStatus[banner.bannerExposeStatus],
      title: banner.title,
      viewCnt: banner.viewCnt,
      url: `${process.env.REACT_APP_CLIENT_URL}/${banner.url}`,
      fileKey:banner.image.fileKey,
      created: moment(banner.created).format('YYYY-MM-DD HH:mm:ss'),
      detail:{
        viewCnt: banner.viewCnt,
        url: `${process.env.REACT_APP_CLIENT_URL}/${banner.url}`,
        fileKey:banner.image.fileKey,
        created: moment(banner.created).format('YYYY-MM-DD HH:mm:ss'),
      }
    };
  });

  // pagination onChange
  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getBanners(currentPage - 1, pageSize, lastSearchCondition);
    },
    [getBanners, lastSearchCondition, pageSize],
  );

  const updateSequenceList = () => {
    const bannerIds :number[] = [];
    sequenceList.map((item,i)=> {
      bannerIds.push(item.bannerId);
    });
    dispatch(updateBannersMainSequenceAsync.request({bannerIds}));
  };

  // 선택오픈
  const handleBannerOpen = (exposeMain:boolean) => {
    const updateBanner :UpdateBanner = {
      exposeMain,
      bannerIds: selectedBanners
    };
    dispatch(updateBannersMainAsync.request(updateBanner));
  };

  const nullDataDelete = (searchCondition:SearchBannerList) => {
      if(searchCondition.bannerType === "TOTAL"){
        delete searchCondition.bannerType
      }
      if(searchCondition.bannerExposeStatus === "TOTAL"){
        delete searchCondition.bannerExposeStatus
      }
      if(searchCondition.title === ""){
        delete searchCondition.title
      }
      return searchCondition;
  };

  const handleBannerSearchChangeOrder = useCallback(value=> {
    setBannerOrderSelected(value);

    const searchCondition:SearchBannerList = {
      bannerOrder:value,
      bannerType:bannerTypeSelected,
      bannerExposeStatus:bannerExposeSelected,
      title:searchInput
    };
    const searchData = nullDataDelete(searchCondition);
    getBanners(0,10, searchData);
  }, [setBannerOrderSelected, searchInput, bannerTypeSelected, bannerOrderSelected, bannerExposeSelected]);


  const handleBannerSearchChangeExpose = useCallback(value => {
    setBannerExposeSelected(value);

    const searchCondition:SearchBannerList = {
      bannerOrder:bannerOrderSelected,
      bannerType:bannerTypeSelected,
      bannerExposeStatus:value,
      title:searchInput
    };
    const searchData = nullDataDelete(searchCondition);
    getBanners(0,10, searchData);
  }, [setBannerOrderSelected, searchInput, bannerTypeSelected, bannerOrderSelected, bannerExposeSelected]);

  const handleBannerSearchChangeType = useCallback(value => {
    setBannerTypeSelected(value);

    const searchCondition:SearchBannerList = {
      bannerOrder:bannerOrderSelected,
      bannerType:value,
      bannerExposeStatus:bannerExposeSelected,
      title:searchInput
    };
    const searchData = nullDataDelete(searchCondition);
    getBanners(0,10, searchData);

  }, [setBannerOrderSelected, searchInput, bannerTypeSelected, bannerOrderSelected, bannerExposeSelected]);

  const handleInputChange = useCallback(e => {
    setSearchInput(e.target.value);
  }, [setBannerOrderSelected, searchInput, bannerTypeSelected, bannerOrderSelected, bannerExposeSelected]);

  const onSearch = useCallback(value => {

    const searchCondition:SearchBannerList = {
      bannerOrder:bannerOrderSelected,
      bannerType:bannerTypeSelected,
      bannerExposeStatus:bannerExposeSelected,
      title:searchInput
    };
    const searchData = nullDataDelete(searchCondition);
    getBanners(0,10, searchData);

  }, [setBannerOrderSelected, searchInput, bannerTypeSelected, bannerOrderSelected, bannerExposeSelected]);

  const handleAddBanner = () => {
    history.push('/bannerAdd');
  };

  const handleShowSequenceListModal = () => {
    setShowSequenceListModal(true);
    setSequenceList(seqList);
  };

  const moveDndItem = (dragIndex: number, hoverIndex: number) => {

    const dragItem =  sequenceList[dragIndex];
    sequenceList.splice(dragIndex, 1);
    sequenceList.splice(hoverIndex, 0,  dragItem);

    const data = sequenceList.map((v, i) => ({
      ...v,
      sequenceId: i + 1,
    }));
    setSequenceList(data);
  };

  // 선택 사용 안함
  const handleDeleteSequenceList = useCallback(
    (value:boolean) => {

      if(seqList.length <= selectedSeqList.length){
        message.error('최소 1개의 공구는 존재해야 합니다.');
        return;
      }

      if (selectedSeqList.length > 0) {
        const updateBanner :UpdateBanner = {
          exposeMain:value,
          bannerIds: selectedSeqList
        };
        dispatch(updateBannersMainAsync.request(updateBanner));
      }
    },
    [selectedSeqList],
  );

  // 선택 삭제
  const handleDeleteBannerList = useCallback(
    () => {

      if(data.length <= selectedBanners.length){
        message.error('최소 1개의 공구는 존재해야 합니다.');
        return;
      }
      if (selectedBanners.length > 0) {
        const selectedBanner :SelectedBanner = {
          bannerIds: selectedBanners
        };
        dispatch(deleteBannersAsync.request(selectedBanner));
      }
    },
    [selectedBanners],
  );
  return (
    <div className="Banner-list">
        <div style={{fontSize: '22px'}}>배너 오픈 관리</div>
        <Table
          title={() => (
            <Row type="flex" justify="space-between">
              <Col>
                <p>검색결과 총 {totalElements}건</p>
              </Col>
              <Col>
                <Button type="primary" icon="ordered-list" onClick={handleShowSequenceListModal}>
                  순서변경
                </Button>
                <Button style={{marginLeft: '10px'}} type="default" icon="scissor" onClick={() => handleDeleteSequenceList(false)}>
                  선택 사용 안함
                </Button>
              </Col>
            </Row>
          )}
          scroll={{ x: 720 }}
          rowSelection={{
            onChange: handleChange,
          }}
          dataSource={mainData}
          columns={columns}
          pagination={false}
        />

      <Divider />
      <div style={{fontSize: '22px'}}>배너 전체 리스트</div>
      <PaginationTable
        title={() => (
          <Row type="flex" justify="space-between">
            <Col>
              <Select style={{ width: 140 }} value={bannerOrderSelected} onChange={handleBannerSearchChangeOrder}>
                <Option value="">전체</Option>
                {BannerOrderJson.map(option => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
              <Select style={{ width: 120, marginLeft:'10px' }} value={bannerTypeSelected} onChange={handleBannerSearchChangeType}>
                <Option value="">전체</Option>
                {BannerTypeJson.map(option => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
              <Select style={{ width: 120, marginLeft:'10px' }} value={bannerExposeSelected} onChange={handleBannerSearchChangeExpose}>
                <Option value="">전체</Option>
                {BannerExposeJson.map(option => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
              <Input  style={{marginLeft:'10px', width: '300px'}} onChange={handleInputChange} value={searchInput} onPressEnter={onSearch} placeholder='배너 제목 검색' />
              <Button style={{marginLeft:'10px'}}  type="primary" icon="search" onClick={onSearch}>
                검색
              </Button>
            </Col>
            <Col>
              <Button type="primary" icon="ordered-list" onClick={() =>handleBannerOpen(true)}>
                선택 오픈
              </Button>
              <Button style={{marginLeft: '10px'}} type="default" icon="scissor" onClick={handleDeleteBannerList}>
                선택 삭제
              </Button>
              <Button style={{marginLeft: '10px'}} type="default" icon="plus" onClick={handleAddBanner}>
                신규 등록
              </Button>
            </Col>
          </Row>
        )}
        scroll={{ x: 720 }}
        rowSelection={{
          onChange: handleChangeBanner,
        }}
        dataSource={data}
        columns={columns}
        pagination={{
          total: totalElements,
          pageSize,
          onChange: handlePaginationChange,
        }}
      />
      {
        showSequenceListModal && (
          <Modal
            centered
            closable={false}
            visible={showSequenceListModal}
            onOk={updateSequenceList}
            onCancel={() => {setShowSequenceListModal(false)}}>
            <DndList>
              {sequenceList && sequenceList.map((item, idx:number) => (
                <DndItem
                  key={item.bannerId}
                  index={idx}
                  id={item.id}
                  moveCard={moveDndItem}
                >
                  <Row type="flex">
                    <Col span={2}>
                      <div style={{textAlign: 'center'}}>{item.bannerId}</div>
                    </Col>
                    <Col span={6}>
                      <div style={{textAlign: 'center'}} >{item.title}</div>
                    </Col>
                    <Col span={10}>
                      <div style={{textAlign: 'center'}}>{item.period}</div>
                    </Col>
                    <Col span={4}>
                      <div style={{textAlign: 'center'}}>{item.bannerExposeStatus}</div>
                    </Col>
                    <Col span={2}>
                      <div style={{textAlign: 'center'}}>{BannerType[item.bannerType]}</div>
                    </Col>
                  </Row>
                </DndItem>
              ))}
            </DndList>
          </Modal>
        )
      }
    </div>
  );
}

export default Banner;
