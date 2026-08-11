import { describe, it, expect, afterEach } from 'vitest';
import { registerPlugin, unregisterPlugin, __resetRegistryForTests } from '@/lib/plugins';
import { componentDefinitions } from '@/config/components';
import type { ComponentDefinition } from '@/types/component';

const calendar = {
  type: 'calendar',
  displayName: 'Calendar',
  category: 'blocks',
  icon: 'calendar',
  defaultProps: { content: { calendarUrl: '' } },
  defaultStyles: { base: { width: '100%' } },
  generateHTML: () => '<iframe></iframe>',
  generateCSS: () => '',
} as unknown as ComponentDefinition;

describe('Plugin registry', () => {
  afterEach(() => {
    __resetRegistryForTests();
  });

  it('exposes components registered after config/components.ts was evaluated', () => {
    expect(componentDefinitions.calendar).toBeUndefined();

    registerPlugin({
      id: 'my-org.calendar',
      name: 'Calendar widget',
      version: '1.0.0',
      components: [calendar],
    });

    expect(componentDefinitions.calendar).toBeDefined();
    expect(componentDefinitions.calendar.displayName).toBe('Calendar');
  });

  it('removes plugin components again on unregister', () => {
    registerPlugin({
      id: 'my-org.calendar',
      name: 'Calendar widget',
      version: '1.0.0',
      components: [calendar],
    });
    unregisterPlugin('my-org.calendar');

    expect(componentDefinitions.calendar).toBeUndefined();
  });

  it('restores the built-in definition when an overriding plugin is removed', () => {
    const original = componentDefinitions.heading;

    registerPlugin({
      id: 'my-org.heading',
      name: 'Custom heading',
      version: '1.0.0',
      components: [{ ...original, displayName: 'Fancy Heading' }],
    });
    expect(componentDefinitions.heading.displayName).toBe('Fancy Heading');

    unregisterPlugin('my-org.heading');
    expect(componentDefinitions.heading).toBe(original);
  });
});
