import type { Meta, StoryObj } from '@storybook/react';
import { StorageBannerView } from './StorageBanner';

const meta: Meta<typeof StorageBannerView> = {
  title: 'Shared/StorageBanner',
  component: StorageBannerView,
  args: { writeFailed: false, corrupted: [], onOpenSettings: () => undefined, onDismissCorrupted: () => undefined },
};
export default meta;

type Story = StoryObj<typeof StorageBannerView>;

export const WriteFailed: Story = { args: { writeFailed: true } };
export const DataReset: Story = { args: { corrupted: ['queue', 'music'] } };
export const Both: Story = { args: { writeFailed: true, corrupted: ['settings'] } };
