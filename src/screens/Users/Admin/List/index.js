import { Button, Col, message, Popconfirm, Row, Switch, Table } from "antd";
import { unionWith } from "lodash";
import React, { Fragment } from "react";
import { useRequest } from "../../../../shared/useRequest";

const List = (props) => {
  let currentPage = 0;

  const listRequest = useRequest({
    url: `/users`,
    payload: {
      default: {
        _embedded: { users: [] },
        page: { totalElements: 0, size: 0 },
      },
    },
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

  const removeRequest = useRequest({
    lazy: true,
    method: "DELETE",
    url: `/users/{id}`,
    alias: {
      remove: [{ out: "vars.id" }],
    },
    onData: () => {
      message.success("Le compte est supprimé");
      listRequest.reload();
    },
    onError: () => message.error("Une erreur est survenue merci de réessayer"),
  });

  const updateRequest = useRequest({
    lazy: true,
    method: "PATCH",
    url: `/users/{id}`,
    alias: {
      update: [
        { in: "id", out: "vars.id" },
        { in: "isAdmin", out: "data.isAdmin" },
      ],
    },
    onData: () => {
      message.success("Le compte est modifié");
      listRequest.reload();
    },
    onError: () => message.error("Une erreur est survenue merci de réessayer"),
  });

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "IsAdmin",
      render: (text, record) => (
        <Row>
          <Col span={2}>
            <Popconfirm
              title=" voulez vous vraiment changer le statut de cet Administrateur ?"
              okText="Oui"
              cancelText="Non"
              onConfirm={() =>
                updateRequest.alias.update({
                  id: record.idd,
                  isAdmin: !record.isAdmin,
                })
              }
            >
              <Switch
                checkedChildren={"admin"}
                defaultChecked={record.isAdmin}
              />
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
    {
      title: "Supprimer",
      render: (text, record) => (
        <Col span={2} offset={2}>
          <Popconfirm
            title=" voulez vous vraiment supprimer cet Administrateur ?"
            okText="Oui"
            cancelText="Non"
            onConfirm={() => removeRequest.alias.remove(record.idd)}
          >
            <Button type="danger" shape="round" icon="delete" size={30} />
          </Popconfirm>
        </Col>
      ),
    },
  ];

  const onChangePage = (current, pageSize) => {
    currentPage = current - 1;
    listRequest.updateConfig({
      params: { page: currentPage, size: 30 },
      pagination: { current: { page: currentPage, size: 30 } },
    });
  };

  const {
    data: {
      _embedded: { users },
      page: { totalElements, size },
    },
    loading: requestIsInProgress,
  } = { ...listRequest };

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
        dataSource={users.map((item) => ({
          ...item,
          key: item.idd,
        }))}
      />
    </Fragment>
  );
};

export default List;
