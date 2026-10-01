import type { Meta, StoryObj } from '@storybook/react';
import { withApp } from '@/stories/decorators';
import { MusicDrawer } from './MusicDrawer';

const meta: Meta<typeof MusicDrawer> = { title: 'Music/MusicDrawer', component: MusicDrawer };
export default meta;

type Story = StoryObj<typeof MusicDrawer>;

export const NoStationSelected: Story = { decorators: [withApp('empty')] };
export const WithCustomStations: Story = { decorators: [withApp('full')] };
