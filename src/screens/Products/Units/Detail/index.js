import "ant-design-pro/dist/ant-design-pro.css";
import { ChartCard, Field } from "ant-design-pro/lib/Charts";
import { Card as CardAntd, Col, Icon, Row, Table, Tooltip } from "antd";
import { Axis, Chart, Geom, Legend, Tooltip as TL } from "bizcharts";
import React from "react";
import { useRequest } from "../../../../shared/useRequest";

const columnsCommunications = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Availability",
    dataIndex: "availability",
  },
  {
    title: "Brand",
    dataIndex: "brand_name",
  },
];

const IntentForm = (props) => {
  const request = useRequest({
    url: `/products/{id}`,
    payload: {
      default: {},
    },
    vars: { id: props.match.params.id },
  });

  if (request.loading) return <span />;

  const sales = (request.data.sales || []).map((e) =>
    e.replace(/"|\[|\]|\\/gm, "").toString()
  );
  const stocks = (request.data.stock_day || []).map((e) =>
    e.replace(/"|\[|\]|\\/gm, "").toString()
  );
  const dates = (request.data.dates || []).map((e) =>
    e.replace(/"|\[|\]|\\/gm, "").toString()
  );

  const data = [];

  let totaleSales = 0;
  let stockAdd = 0;
  dates.forEach((reference, index) => {
    totaleSales += parseInt(sales[index]);
    stockAdd += parseInt(stocks[index]);
    data[index * 2] = {
      type: "Sales",
      reference,
      value: parseInt(sales[index]),
    };
    data[index * 2 + 1] = {
      type: "Stock",
      reference,
      value: parseInt(stocks[index]),
    };
  });

  return (
    <div>
      <Row>
        <Col span={24} style={{ marginTop: 24 }}>
          <CardAntd title="Detail de produit" bordered={false}>
            <Table
              columns={columnsCommunications}
              dataSource={[request.data || {}]}
            />
          </CardAntd>
        </Col>
        <Col span={24}>
          <ChartCard
            action={
              <Tooltip title="Fréquence d'utilisation de l'application mobile">
                <Icon type="info-circle-o" />
              </Tooltip>
            }
            title="Nombre totale de ventes"
            total={<span>{totaleSales}</span>}
            footer={
              <div>
                <Field label="Augmentation sur stock" value={stockAdd} />
              </div>
            }
          >
            <Chart height={220} data={data} forceFit>
              <Legend />
              <Axis name="reference" />
              <Axis name="value" />
              <TL />

              <Geom
                type="area"
                position="reference*value"
                shape={"smooth"}
                color={[
                  "type",
                  [
                    "l (90) 0:rgba(0, 146, 255, 1) 1:rgba(0, 146, 255, 0.1)",
                    "l (90) 0:rgba(0, 268, 0, 1) 1:rgba(0, 268, 0, 0.1)",
                  ],
                ]}
                tooltip={null}
              />
              <Geom
                type="line"
                position="reference*value"
                shape={"smooth"}
                size={2}
                color={["type", ["rgba(0, 146, 255, 1)", "#00ff00"]]}
              />
            </Chart>
          </ChartCard>
        </Col>
      </Row>
    </div>
  );
};

export default IntentForm;
