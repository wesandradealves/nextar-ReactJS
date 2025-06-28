import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Adicione argumentos personalizados se necessário
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story padrão
export const Default: Story = {
  args: {},
};

// Story com fundo escuro
export const DarkBackground: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Story com fundo temático antártico
export const AntarcticTheme: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'antarctic' },
  },
};
