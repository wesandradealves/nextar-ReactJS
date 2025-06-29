import type { Meta, StoryObj } from '@storybook/react';
import Counter from './index';

const meta: Meta<typeof Counter> = {
  title: 'Atoms/Counter',
  component: Counter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 10000 },
      description: 'Valor final do contador',
    },
    duration: {
      control: { type: 'number', min: 500, max: 5000 },
      description: 'Duração da animação em millisegundos',
    },
    loading: {
      control: 'boolean',
      description: 'Estado de loading',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 42,
    duration: 1500,
    loading: false,
  },
};

export const FastAnimation: Story = {
  args: {
    value: 156,
    duration: 800,
    loading: false,
  },
};

export const SlowAnimation: Story = {
  args: {
    value: 1234,
    duration: 3000,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    value: 100,
    duration: 1500,
    loading: true,
  },
};

export const LargeNumbers: Story = {
  args: {
    value: 9999,
    duration: 2000,
    loading: false,
  },
};

export const SmallNumbers: Story = {
  args: {
    value: 3,
    duration: 1000,
    loading: false,
  },
};
