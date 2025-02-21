import { message } from 'antd';

interface IToast {
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
  content: string;
}

export let showToast: (data: IToast) => void;

export const ToastContainer = () => {
  const [messageApi, contextHolder] = message.useMessage();

  showToast = ({ type = 'success', content }: IToast) => {
    messageApi.open({
      type,
      content,
    });
  };

  return contextHolder;
};