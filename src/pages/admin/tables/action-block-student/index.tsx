/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Space } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

interface IActionBlock {
  onClickAction?: (action?: any) => void;
  onDeleteMulti?: () => void;
  onExportShareholder?: () => void;
  getListData?: () => void;
}

export default function ActionBlock({
  onClickAction,
  selectedRows,
  getListData,
}: IActionBlock) {
  //   const onAdd = () => {
  //     onClickAction("add");
  //   };

  //   const deleteDataItems = useCallback(
  //     (listsId: Array<number>) => {
  //       showLoading();
  //       const deleteSub = deleteEsop(listsId).subscribe({
  //         next: () => {
  //           removeLoading();
  //           showToast({
  //             type: "success",
  //             content: "Delete successful",
  //           });
  //           getListData();
  //         },
  //         error: () => {
  //           removeLoading();
  //         },
  //       });

  //       subscription.add(deleteSub);
  //     },
  //     [getListData, subscription]
  //   );

  //   const onDelete = () => {
  //     if (!selectedRows.length)
  //       return showToast({
  //         type: "info",
  //         content: "Please select item to delete",
  //       });

  //     Modal.confirm({
  //       icon: <ExclamationCircleOutlined />,
  //       title: "Are you sure you want to delete?",
  //       onOk: () => {
  //         deleteDataItems(selectedRows.map((row) => row.id));
  //       },
  //     });
  //   };

  return (
    <div className="action">
      <Space size={12}>
        <Button icon={<PlusCircleOutlined />} type="primary">
          Add
        </Button>
        <Button danger icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Space>
    </div>
  );
}
