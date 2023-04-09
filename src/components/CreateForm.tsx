import { Form, FormInstance, Input, Select } from 'antd';

interface props {
  createForm: FormInstance;
  repos: string[];
}

export const CreateForm = ({ createForm, repos }: props) => {
  const fields = [
    { name: 'title', value: '' },
    { name: 'body', value: '' },
    { name: 'repo', value: repos[0] },
  ];
  const options = repos.map(repo => {
    return { value: repo, label: repo };
  });

  const selectChangeHandler = () => {};

  return (
    <Form layout="vertical" fields={fields} form={createForm}>
      <Form.Item label="Repo" name="repo">
        <Select
          style={{ width: 150, textAlign: 'left', marginRight: '1rem' }}
          onChange={selectChangeHandler}
          options={options}
        />
      </Form.Item>
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
