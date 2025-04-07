import { Button, Modal, Space } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { IGetListClasses } from "@/api/admin/api-classes/get-list-class.api";
import { deleteClass } from "@/api/admin/api-classes/delete-class.api";
import { useAuth } from "@/hooks/use-auth.hook";

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

  const { userRoles } = useAuth();

  const isTeacher = userRoles.some((role) => role === "TEACHER");

  const deleteDataItems = useCallback(
    (listsId: Array<number>) => {
      showLoading();
      const deleteSub = deleteClass(listsId).subscribe({
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
        <div>Quản lí lớp học</div>
        {!isTeacher && (
          <div>
            <Space size={12}>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={onAdd}
              >
                Thêm
              </Button>
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
        )}
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
