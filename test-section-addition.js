// Test script to verify section components can be added correctly
// This simulates what happens when adding a hero section

const testSectionData = {
  id: 'hero-section-1',
  type: 'section',
  // NOTE: displayName is missing - this is the issue!
  props: {
    className: 'hero-section',
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 20px'
    }
  },
  children: [
    {
      id: 'hero-container',
      type: 'container',
      // NOTE: displayName is missing here too!
      props: {
        style: {
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }
      },
      children: [
        {
          id: 'hero-content',
          type: 'div',
          // NOTE: And missing here!
          props: {
            style: { color: 'white' }
          },
          children: [
            {
              id: 'hero-title',
              type: 'heading',
              // Missing displayName
              props: {
                level: 1,
                text: 'Build Amazing Websites Without Code',
                style: {
                  fontSize: '48px',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                  lineHeight: '1.2'
                }
              },
              children: []
            }
          ]
        }
      ]
    }
  ]
};

// The fix in addSectionComponents should:
// 1. Add displayName to every component in the tree
// 2. Ensure styles property exists with base property
// 3. Generate new unique IDs

console.log('Test section data structure:');
console.log(JSON.stringify(testSectionData, null, 2));

// After processing, each component should have:
// - id: new unique ID
// - type: preserved from original
// - displayName: added from componentDefinitions or fallback to type
// - props: preserved from original
// - styles: { base: props.style || {} }
// - children: recursively processed