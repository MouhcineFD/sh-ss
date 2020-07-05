import { Avatar, Button, Icon, Input, Modal, Table } from "antd";
import { unionWith } from "lodash";
import React, { Fragment, useState } from "react";
import Highlighter from "react-highlight-words";
import TextRendrer from "../../../../shared/components/TextRendrer";
import { useRequest } from "../../../../shared/useRequest";
import { communicationStyle } from "./../../style";

const renderText = (text) => {
  return <TextRendrer text={text} />;
};

const renderImage = (text, record) => {
  return <Avatar shape="square" size={64} src={record.image} />;
};
const renderLink = (text, record) => {
  return <a href={record.product_url}>Here</a>;
};

const render = { text: renderText, image: renderImage, link: renderLink };

const List = (props) => {
  const request = useRequest({
    url: `/products/search/findByProductFrom`,
    payload: {
      default: {
        _embedded: { products: [] },
        page: { totalElements: 0, size: 0 },
      },
    },
    params: { productFrom: props.match.params.brand },
    pagination: {
      path: "params",
      initial: { page: 0, size: 20 },
      next: ({ page, size }) => ({
        size,
        page: page + 1,
      }),
      onLoadMore: (next, prev) =>
        unionWith(prev, next, ({ id: a }, { id: b }) => a === b),
    },
    alias: {
      loadPage: [{ in: "", out: "params.page" }],
    },
  });

  let currentPage = 0;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchText, setSearchText] = useState("");

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder="Taper votre recherche"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 220, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={communicationStyle.searchButton}
        >
          Rechercher
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={communicationStyle.clearSearchButton}
        >
          Vider le filtre
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon
        type="search"
        style={{
          color: filtered ? "#00915A" : "#b7ba28",
          fontSize: 14,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) => (
      <Highlighter
        highlightStyle={communicationStyle.highlightStyle}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "15%",
      render: render["text"],
      ...getColumnSearchProps("name"),
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "15%",
      render: render["text"],
      ...getColumnSearchProps("category"),
    },
    {
      title: "Link",
      dataIndex: "product_url",
      width: "10%",
      render: render["link"],
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price.length - b.price.length,
    },
    {
      title: "Availability",
      dataIndex: "availability",
      sorter: (a, b) => a.availability.length - b.availability.length,
    },
    {
      title: "Number of reviews",
      dataIndex: "num_of_reviews",
      render: (text, item) => (
        <text>{item.num_of_reviews == null ? 0 : item.num_of_reviews}</text>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "10%",
      render: render["image"],
      onCell: (record) => {
        return {
          onClick: () => {
            setIsModalVisible(true);
            setSelectedImage(record.image);
          },
        };
      },
    },
    {
      title: "Actions",
      key: "identifiant",
      width: "30%",
      render: (text, record) => (
        <Button
          style={communicationStyle.listButton}
          shape="round"
          icon="bar-chart"
          size={30}
          onClick={() => {
            props.history.push(`/product/${record.idd}`);
          }}
        />
      ),
    },
  ];

  const onChangePage = (current, pageSize) => {
    currentPage = current - 1;
    request.updateConfig({
      params: { page: currentPage, size: 30 },
      pagination: { current: { page: currentPage, size: 30 } },
    });
  };

  const {
    data: {
      _embedded: { products },
      page: { totalElements, size },
    },
    loading: requestIsInProgress,
  } = { ...request };

  return (
    <Fragment>
      <Table
        size="small"
        pagination={{
          pageSize: size,
          total: totalElements,
          onChange: onChangePage,
        }}
        columns={columns}
        loading={requestIsInProgress}
        dataSource={products.map((item) => {
          return {
            ...item,
            key: item.identifiant,
          };
        })}
      />
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={selectedImage} />
      </Modal>
    </Fragment>
  );
};

export default List;
