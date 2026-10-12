import React, { useState } from "react";
import {
  Form,
  Space,
  Input,
  Select,
  Popconfirm,
  Table,
  Typography,
  Button,
} from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  SaveTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import axios from "axios";
const EditableCell = (props) => {
  const {
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  } = props;
  let inputNode;
  if (inputType === "select") {
    inputNode = <Select options={props.options} />;
  } else if (inputType === "date") {
    inputNode = <Input type="date" />;
  } else {
    inputNode = <Input />;
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
function ProductTable() {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [addKey, setAddedKey] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const isEditing = (record) => record.id === editingKey;
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/expense",
          {
            params: { dateFilter },
            withCredentials: true,
          },
        );
        setProducts(response.data.data);
      } catch (err) {
        console.error(
          "Failed to load expenses:",
          err.response?.data?.message ?? err.message,
        );
      }
    }
    getData();
  }, [dateFilter]);
  const handleAdd = () => {
    const newData = {
      id: products.length + 1,
      title: "",
      amount: "",
      description: "",
      category: "",
      date: "",
    };
    setEditingKey(newData.id);
    setAddedKey(newData.id);
    setProducts([...products, newData]);
  };
  const edit = (record) => {
    form.setFieldsValue({
      title: "",
      amount: "",
      description: "",
      category: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = (record) => {
    if (addKey === record.id) {
      setProducts((prev) => {
        return prev.filter((prev) => prev.id !== addKey);
      });
    }
    setEditingKey("");
  };
  const save = async (record) => {
    try {
      const values = await form.validateFields();
        const payload = { ...record, ...values };
        if (addKey === payload.id) {
        const response = await axios.post(
          "http://localhost:5001/api/expense",
          payload,
          { withCredentials: true },
        );
        setProducts((previous) =>
          previous.map((product) =>
            product.id === record.id ? response.data.data : product,
          ),
        );
      } else {
        const response = await axios.put(
          `http://localhost:5001/api/expense/${record._id}`,
          payload,
          { withCredentials: true },
        );
        setProducts((previous) =>
          previous.map((product) =>
            product.id === record.id ? response.data.data : product,
          ),
        );
      }
      setEditingKey("");
      setAddedKey(null);
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };
  const deleteRow = async (record) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/expense/${record._id}`,
        { withCredentials: true },
      );
      setProducts((previous) =>
        previous.filter((product) => {
          return product.id !== record.id;
        }),
      );
    } catch (err) {
      console.log(err);
    }
  };
  const columns = [
    {
      title: "title",
      dataIndex: "title",
      width: "20%",
      editable: true,
      inputType: "text",
    },
    {
      title: "amount",
      dataIndex: "amount",
      width: "15%",
      editable: true,
      inputType: "text",
    },
    {
      title: "description",
      dataIndex: "description",
      width: "30%",
      editable: true,
      inputType: "text",
    },
    {
      title: "date",
      dataIndex: "date",
      width: "15%",
      editable: true,
      inputType: "date",
    },
    {
      title: "category",
      dataIndex: "category",
      width: "30%",
      editable: true,
      inputType: "select",
      options: [
        { label: "Food", value: "Food" },
        { label: "Travel", value: "Travel" },
        { label: "Shopping", value: "Shopping" },
        { label: "Entertainment", value: "Entertainment" },
        { label: "Health", value: "Health" },
        { label: "Education", value: "Education" },
        { label: "Bills", value: "Bills" },
        { label: "Miscellaneous", value: "Miscellaneous" },
      ],
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{ marginRight: 8 }}
            >
              <SaveTwoTone />
            </Typography.Link>
            <CloseCircleTwoTone onClick={() => cancel(record)} />
          </span>
        ) : (
          <Space size="middle">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <EditTwoTone />
            </Typography.Link>

            {products.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => deleteRow(record)}
              >
                <DeleteTwoTone />
              </Popconfirm>
            ) : null}
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        options: col.options,
      }),
    };
  });
  return (
    <>
      <Form component={false} form={form}>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={handleAdd} type="primary">
            Add a row
          </Button>
          <Select
            aria-label="Filter expenses by date"
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { label: "All Dates", value: "all" },
              { label: "Today", value: "today" },
              { label: "Last 7 Days", value: "last7Days" },
              { label: "This Month", value: "thisMonth" },
              { label: "Last Month", value: "lastMonth" },
            ]}
            style={{ width: 160 }}
          />
        </Space>
        <Table
          bordered
          rowKey="id"
          columns={mergedColumns}
          components={{ body: { cell: EditableCell } }}
          dataSource={products}
        />
      </Form>
    </>
  );
}
export default ProductTable;
