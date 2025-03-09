import { Button, Modal, Space } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { IGetListUsers } from "@/api/admin/get-list-userInfo.api";
import { deleteUser } from "@/api/admin/delete-user.api";

interface IActionBlock {
  onClickAction: (action?: any) => void;
  getListData: () => void;
  selectedRows: IGetListUsers[];
}

export default function ActionBlockUsers({
  onClickAction,
  getListData,
  selectedRows,
}: IActionBlock) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const onAdd = () => {
    onClickAction('add');
  };

  const deleteDataItems = useCallback(
    (listsId: Array<number>) => {
      showLoading();
      const deleteSub = deleteUser(listsId).subscribe({
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
    deleteDataItems(selectedRows.map((row) => row.id).filter((id): id is number => id !== undefined));
    setIsDeleteModalOpen(false);
  };


  return (
    <div>
      <div className="flex justify-between font-bold text-lg mt-5">
        <div>Users Management</div>
        <div><Space size={12}>
          <Button icon={<PlusCircleOutlined />} type="primary" onClick={onAdd}>
            Add
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={showDeleteModal} disabled={!selectedRows.length}>
            Delete
          </Button>
        </Space></div>
        
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
