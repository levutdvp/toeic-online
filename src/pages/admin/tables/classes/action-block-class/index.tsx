import { Button, Modal, Space } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { IGetListClasses } from "@/api/api-classes/get-list-class.api";
import { deleteClass } from "@/api/api-classes/delete-class.api";

interface IActionBlock {
  onClickAction: (action?: any) => void;
  getListData: () => void;
  selectedRows: IGetListClasses[];
}

export default function ActionBlockClasses({
  onClickAction,
  getListData,
  selectedRows,
}: IActionBlock) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const onAdd = () => {
    onClickAction("add");
  };

  const deleteDataItems = useCallback(
    (listsId: Array<number>) => {
      showLoading();
      const deleteSub = deleteClass(listsId).subscribe({
        next: () => {
          removeLoading();
          showToast({
            type: "success",
            content: "Delete successful",
          });
          getListData();
        },
        error: () => {
          removeLoading();
        },
      });

      deleteSub.add();
    },
    [getListData]
  );

  const handleDeleteConfirm = () => {
    deleteDataItems(
      selectedRows
        .map((row) => row.id)
        .filter((id): id is number => id !== undefined)
    );
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between font-bold text-lg mt-5">
        <div>Class Management</div>
        <div>
          <Space size={12}>
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={onAdd}
            >
              Add
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={showDeleteModal}
              disabled={!selectedRows.length}
            >
              Delete
            </Button>
          </Space>
        </div>
      </div>
      <div>
        <Modal
          title="Confirm deletion"
          open={isDeleteModalOpen}
          onOk={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
          zIndex={9999}
        >
          <p>Do you want to delete?</p>
        </Modal>
      </div>
    </div>
  );
}
