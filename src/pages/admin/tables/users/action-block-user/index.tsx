import { deleteUser } from "@/api/admin/api-users/delete-user.api";
import { IGetListUsers } from "@/api/admin/api-users/get-list-userInfo.api";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useCallback, useState } from "react";

interface IActionBlock {
  onClickAction: (action?: any) => void;
  getListData: () => void;
  selectedRows: IGetListUsers[];
}

export default function ActionBlockUsers({
  getListData,
  selectedRows,
}: IActionBlock) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const deleteDataItems = useCallback(
    (listsId: Array<number>) => {
      showLoading();
      const deleteSub = deleteUser(listsId).subscribe({
        next: () => {
          removeLoading();
          showToast({
            type: "success",
            content: "Xóa thành công!",
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
        <div>Danh sách tài khoản</div>
        <div>
          <Space size={12}>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={showDeleteModal}
              disabled={!selectedRows.length}
            >
              Xóa
            </Button>
          </Space>
        </div>
      </div>
      <div>
        <Modal
          title="Xác nhận xóa"
          open={isDeleteModalOpen}
          onOk={handleDeleteConfirm}
          okText="Xóa"
          cancelText="Hủy bỏ"
          okButtonProps={{ danger: true }}
          onCancel={() => setIsDeleteModalOpen(false)}
          zIndex={9999}
        >
          <p>Bạn có chắc chắn muốn xóa?</p>
        </Modal>
      </div>
    </div>
  );
}
