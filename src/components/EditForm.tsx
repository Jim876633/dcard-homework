import { GetIssueType } from '@src/models/IssueType';
import { Form, Input, FormInstance } from 'antd';

interface props {
  issue: GetIssueType;
  editForm: FormInstance;
}

export const EditForm = ({ issue, editForm }: props) => {
  const fields = [
    { name: 'title', value: issue.title },
    { name: 'body', value: issue.body },
  ];

  return (
    <Form layout="vertical" fields={fields} form={editForm}>
      <Form.Item
        label="Title"
        name="title"
        required
        rules={[{ required: true, message: 'Title is required' }]}
      >
        <Input placeholder="Please text some title" />
      </Form.Item>
      <Form.Item label="Body" name="body">
        <Input placeholder="Please text some body" />
      </Form.Item>
    </Form>
  );
};
