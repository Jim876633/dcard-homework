import { GetIssueType } from '@src/models/IssueType';
import { Form, FormInstance, Input } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';

interface props {
  fields: FieldData[];
  issue: GetIssueType;
  editForm: FormInstance;
}

export const EditForm = ({ fields, issue, editForm }: props) => {
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
