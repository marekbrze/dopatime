import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { withApp } from '@/stories/decorators';
import { useTimerRunner } from '../hooks/use-timer-runner';
import { RunView } from './RunView';
import { MINUTE } from '@/shared/lib/format';

/** Starts a run as soon as the story mounts, so the run view has something to show. */
function Running({ alternating = false, name = 'Deep work' }: { alternating?: boolean; name?: string }) {
  const { start, run } = useTimerRunner();
  useEffect(() => {
    start(
      alternating
        ? { kind: 'alternating', phases: [{ id: 'a', durationMs: 25 * MINUTE }, { id: 'b', durationMs: 5 * MINUTE }], cycles: 4 }
        : { kind: 'simple', durationMs: 10 * MINUTE },
      name,
    );
  }, []);
  return run ? <RunView /> : null;
}

const meta: Meta<typeof Running> = {
  title: 'Timer Engine/RunView',
  component: Running,
  decorators: [withApp('empty')],
};
export default meta;

type Story = StoryObj<typeof Running>;

export const SimpleRunning: Story = {};
export const Alternating: Story = { args: { alternating: true } };
export const VeryLongName: Story = { args: { name: 'A very long timer name that would not fit on a single line of the stage at all' } };
