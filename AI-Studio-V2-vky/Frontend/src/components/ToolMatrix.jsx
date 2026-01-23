import React, { useState, useMemo, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, ExternalLink, Star, TrendingUp, Users, BookOpen, Code, CheckCircle, AlertCircle } from 'lucide-react';
import PlatformUsageChart from './PlatformUsageChart';

const ToolMatrix = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedCost, setSelectedCost] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [expandedTool, setExpandedTool] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleBack = () =>{
    navigate(-1);
  }


  const tools = [
    {
      id: 1,
      name: 'Jest',
      category: 'Unit Testing',
      tech: ['JavaScript', 'React', 'Node.js'],
      cost: 'Free',
      level: 'Beginner',
      logo: '🃏',
      stars: '44k',
      downloads: '35M/week',
      bestFor: ['React Testing', 'Snapshot Testing', 'Code Coverage'],
      pros: ['Zero config', 'Great documentation', 'Fast parallel testing'],
      cons: ['Limited browser testing', 'Verbose mocks'],
      description: 'Delightful JavaScript testing framework with a focus on simplicity',
      usedBy: ['Facebook', 'Airbnb', 'Spotify'],
      integration: ['CI/CD', 'VS Code', 'WebStorm'],
      codeExample: `test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});`
    },
//     {
//       id: 2,
//       name: 'Cypress',
//       category: 'E2E Testing',
//       tech: ['JavaScript', 'React', 'Vue', 'Angular'],
//       cost: 'Freemium',
//       level: 'Intermediate',
//       logo: '🌲',
//       stars: '46k',
//       downloads: '5M/week',
//       bestFor: ['E2E Testing', 'Visual Testing', 'API Testing'],
//       pros: ['Time travel debugging', 'Real-time reload', 'Automatic waiting'],
//       cons: ['Single browser at a time', 'No multi-tab support'],
//       description: 'Fast, easy and reliable testing for anything that runs in a browser',
//       usedBy: ['Disney', 'Shopify', 'DoorDash'],
//       integration: ['GitHub Actions', 'CircleCI', 'Docker'],
//       codeExample: `cy.visit('/login')
// cy.get('[data-test=email]').type('user@example.com')
// cy.get('[data-test=submit]').click()`
//     },
    {
      id: 3,
      name: 'Selenium',
      category: 'E2E Testing',
      tech: ['Java', 'Python', 'C#', 'JavaScript'],
      cost: 'Free',
      level: 'Advanced',
      logo: '🔬',
      stars: '29k',
      downloads: '8M/month',
      bestFor: ['Cross-browser Testing', 'Mobile Testing', 'Legacy Systems'],
      pros: ['Multi-browser support', 'Language flexibility', 'Large community'],
      cons: ['Steep learning curve', 'Flaky tests', 'Slow execution'],
      description: 'Browser automation framework for web application testing',
      usedBy: ['Google', 'Microsoft', 'Amazon'],
      integration: ['Jenkins', 'Docker', 'Sauce Labs'],
      codeExample: `WebDriver driver = new ChromeDriver();
driver.get("https://example.com");
driver.findElement(By.id("submit")).click();`
    },
//     {
//       id: 4,
//       name: 'Playwright',
//       category: 'E2E Testing',
//       tech: ['JavaScript', 'TypeScript', 'Python', 'Java'],
//       cost: 'Free',
//       level: 'Intermediate',
//       logo: '🎭',
//       stars: '62k',
//       downloads: '4M/week',
//       bestFor: ['Multi-browser Testing', 'API Testing', 'Mobile Emulation'],
//       pros: ['Auto-wait', 'Multi-browser', 'Network interception'],
//       cons: ['Newer ecosystem', 'Limited IDE support'],
//       description: 'Reliable end-to-end testing for modern web apps',
//       usedBy: ['Microsoft', 'VSCode', 'Bing'],
//       integration: ['GitHub Actions', 'Docker', 'Azure'],
//       codeExample: `await page.goto('https://example.com');
// await page.click('button#submit');
// await expect(page).toHaveURL(/success/);`
//     },
    {
      id: 5,
      name: 'JUnit',
      category: 'Unit Testing',
      tech: ['Java', 'Kotlin'],
      cost: 'Free',
      level: 'Beginner',
      logo: '☕',
      stars: '8k',
      downloads: '50M/month',
      bestFor: ['Java Testing', 'TDD', 'Integration Testing'],
      pros: ['Industry standard', 'Annotation-based', 'Great IDE support'],
      cons: ['Java-only', 'Verbose syntax'],
      description: 'Simple framework for writing repeatable tests in Java',
      usedBy: ['Netflix', 'LinkedIn', 'Uber'],
      integration: ['Maven', 'Gradle', 'IntelliJ IDEA'],
      codeExample: `@Test
public void testAddition() {
    assertEquals(3, calculator.add(1, 2));
}`
    },
    {
      id: 6,
      name: 'Pytest',
      category: 'Unit Testing',
      tech: ['Python'],
      cost: 'Free',
      level: 'Beginner',
      logo: '🐍',
      stars: '11k',
      downloads: '45M/month',
      bestFor: ['Python Testing', 'Fixtures', 'Parametrized Testing'],
      pros: ['Simple syntax', 'Rich plugin ecosystem', 'Detailed assertions'],
      cons: ['Python-only', 'Can be slow for large suites'],
      description: 'Mature full-featured Python testing tool',
      usedBy: ['Dropbox', 'Mozilla', 'Stripe'],
      integration: ['tox', 'Jenkins', 'GitLab CI'],
      codeExample: `def test_addition():
    assert 1 + 2 == 3
    
def test_string_length():
    assert len("hello") == 5`
    },
    {
      id: 7,
      name: 'Postman',
      category: 'API Testing',
      tech: ['REST', 'GraphQL', 'SOAP'],
      cost: 'Freemium',
      level: 'Beginner',
      logo: '📮',
      stars: 'N/A',
      downloads: '25M users',
      bestFor: ['API Development', 'Manual Testing', 'Documentation'],
      pros: ['User-friendly UI', 'Collection sharing', 'Mock servers'],
      cons: ['Limited automation', 'Heavy desktop app'],
      description: 'API platform for building and using APIs',
      usedBy: ['Twitter', 'Salesforce', 'Cisco'],
      integration: ['Newman', 'Jenkins', 'GitHub'],
      codeExample: `pm.test("Status is 200", () => {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json()).to.have.property('data');
});`
    },
    {
      id: 8,
      name: 'JMeter',
      category: 'Performance Testing',
      tech: ['Java', 'HTTP', 'FTP'],
      cost: 'Free',
      level: 'Advanced',
      logo: '⚡',
      stars: '7k',
      downloads: '2M/month',
      bestFor: ['Load Testing', 'Stress Testing', 'Performance Analysis'],
      pros: ['Highly scalable', 'Protocol support', 'Detailed reports'],
      cons: ['Complex UI', 'Resource-heavy', 'Steep curve'],
      description: 'Java application for load testing and performance measurement',
      usedBy: ['PayPal', 'Oracle', 'NASA'],
      integration: ['Jenkins', 'Grafana', 'InfluxDB'],
      codeExample: `// Thread Group: 100 users
// Ramp-up: 10 seconds
// Loop: 5 times
// HTTP Request: GET /api/products`
    },
//     {
//       id: 9,
//       name: 'K6',
//       category: 'Performance Testing',
//       tech: ['JavaScript', 'Go'],
//       cost: 'Freemium',
//       level: 'Intermediate',
//       logo: '📊',
//       stars: '23k',
//       downloads: '500k/month',
//       bestFor: ['Load Testing', 'Developer-friendly Testing', 'CI/CD Integration'],
//       pros: ['Scriptable in JS', 'Beautiful CLI output', 'Cloud integration'],
//       cons: ['Limited protocol support', 'Browser testing complex'],
//       description: 'Modern load testing tool for developers',
//       usedBy: ['Grafana Labs', 'EA', 'Samsung'],
//       integration: ['GitHub Actions', 'GitLab', 'Grafana Cloud'],
//       codeExample: `import http from 'k6/http';
// export default function() {
//   http.get('https://api.example.com/products');
// }`
//     },
//     {
//       id: 10,
//       name: 'TestNG',
//       category: 'Unit Testing',
//       tech: ['Java'],
//       cost: 'Free',
//       level: 'Intermediate',
//       logo: '🧪',
//       stars: '2k',
//       downloads: '15M/month',
//       bestFor: ['Data-driven Testing', 'Parallel Testing', 'Advanced Reporting'],
//       pros: ['Flexible configuration', 'Powerful annotations', 'Parallel execution'],
//       cons: ['Complex for beginners', 'XML configuration'],
//       description: 'Testing framework inspired by JUnit with more powerful features',
//       usedBy: ['Accenture', 'Cognizant', 'Infosys'],
//       integration: ['Maven', 'Selenium', 'Jenkins'],
//       codeExample: `@Test(priority = 1)
// public void loginTest() {
//     // Test login functionality
// }`
//     },
    {
      id: 11,
      name: 'Appium',
      category: 'Mobile Testing',
      tech: ['iOS', 'Android', 'React Native'],
      cost: 'Free',
      level: 'Advanced',
      logo: '📱',
      stars: '18k',
      downloads: '1M/month',
      bestFor: ['Mobile App Testing', 'Cross-platform Testing', 'Hybrid Apps'],
      pros: ['Cross-platform', 'Multiple languages', 'Real device testing'],
      cons: ['Slow execution', 'Complex setup', 'Flaky tests'],
      description: 'Automation framework for mobile applications',
      usedBy: ['Walmart', 'eBay', 'PayPal'],
      integration: ['Selenium Grid', 'BrowserStack', 'Sauce Labs'],
      codeExample: `driver.findElement(By.id("loginButton")).click();
driver.findElement(By.id("email")).sendKeys("user@example.com");`
    },
    {
      id: 12,
      name: 'SonarQube',
      category: 'Code Quality',
      tech: ['Java', 'JavaScript', 'Python', 'C#'],
      cost: 'Freemium',
      level: 'Intermediate',
      logo: '🔍',
      stars: '8k',
      downloads: '500k/month',
      bestFor: ['Static Analysis', 'Code Coverage', 'Security Vulnerabilities'],
      pros: ['Comprehensive analysis', 'Quality gates', 'Multi-language'],
      cons: ['Resource intensive', 'Complex setup'],
      description: 'Continuous inspection of code quality and security',
      usedBy: ['NASA', 'Cisco', 'SAP'],
      integration: ['Jenkins', 'Azure DevOps', 'GitLab'],
      codeExample: `// Automatically scans code for:
// - Bugs
// - Code smells
// - Security vulnerabilities
// - Code coverage`
    }
  ];

  const categories = ['All', 'Unit Testing', 'E2E Testing', 'API Testing', 'Performance Testing', 'Mobile Testing', 'Code Quality'];
  const techStacks = ['All', 'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript'];
  const costOptions = ['All', 'Free', 'Freemium'];
  const levelOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.bestFor.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesTech = selectedTech === 'All' || tool.tech.includes(selectedTech);
      const matchesCost = selectedCost === 'All' || tool.cost === selectedCost;
      const matchesLevel = selectedLevel === 'All' || tool.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesTech && matchesCost && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedTech, selectedCost, selectedLevel]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTech('All');
    setSelectedCost('All');
    setSelectedLevel('All');
  };

  const activeFiltersCount = [selectedCategory, selectedTech, selectedCost, selectedLevel].filter(f => f !== 'All').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
        {/* Left: Title + Description */}
        <div>
            <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">🔧</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Testing Tool Matrix
            </h1>
            </div>
            <p className="text-slate-400 text-lg">
            Discover, compare, and choose the right testing tools for your project
            </p>
        </div>

        {/* Right: Back Button */}
        <button
            onClick={handleBack}
            className="h-fit px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium transition flex items-center gap-2 shadow"
        >
            ← Back
        </button>
        </div>

        <PlatformUsageChart />


        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search tools by name, description, or use case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tech Stack Filter */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Tech Stack</label>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {techStacks.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>

            {/* Cost Filter */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Cost</label>
              <select
                value={selectedCost}
                onChange={(e) => setSelectedCost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {costOptions.map(cost => (
                  <option key={cost} value={cost}>{cost}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Difficulty Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levelOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-slate-400 text-sm">
          Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{tool.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                      <span className="text-xs text-slate-400">{tool.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.cost === 'Free' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tool.cost}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.level === 'Beginner' ? 'bg-blue-500/20 text-blue-400' :
                      tool.level === 'Intermediate' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {tool.level}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-4 line-clamp-2">{tool.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" />
                    <span>{tool.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span>{tool.downloads}</span>
                  </div>
                </div>

                {/* Best For Tags */}
                <div className="mb-4">
                  <div className="text-xs text-slate-400 mb-2">Best for:</div>
                  <div className="flex flex-wrap gap-2">
                    {tool.bestFor.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="text-xs text-slate-400 mb-2">Tech Stack:</div>
                  <div className="flex flex-wrap gap-2">
                    {tool.tech.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expand Button */}
                <button
                onClick={() => setSelectedTool(tool)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition"
                >
                View Details
                </button>

              </div>

              {/* Expanded Content */}

            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No tools found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Right Side Drawer */}
{selectedTool && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={() => setSelectedTool(null)}
    />

    {/* Drawer */}
    <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-slate-900 border-l border-slate-700 z-50 overflow-y-auto">
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{selectedTool.logo}</div>
            <div>
              <h2 className="text-2xl font-bold">{selectedTool.name}</h2>
              <p className="text-slate-400 text-sm">{selectedTool.category}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedTool(null)}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Meta */}
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
            {selectedTool.cost}
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            {selectedTool.level}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-300">{selectedTool.description}</p>

        {/* Best For */}
        <section>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Best For</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTool.bestFor.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTool.tech.map((tech, i) => (
              <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/30">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-2">Pros</h3>
            <ul className="space-y-1">
              {selectedTool.pros.map((p, i) => (
                <li key={i} className="text-xs text-slate-300">• {p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-2">Cons</h3>
            <ul className="space-y-1">
              {selectedTool.cons.map((c, i) => (
                <li key={i} className="text-xs text-slate-300">• {c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Used By */}
        <section>
          <h3 className="text-sm font-semibold text-purple-400 mb-2">Used By</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTool.usedBy.map((u, i) => (
              <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded">
                {u}
              </span>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Integrations</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTool.integration.map((int, i) => (
              <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                {int}
              </span>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section>
          <h3 className="text-sm font-semibold text-green-400 mb-2">Quick Example</h3>
          <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto">
            <code className="text-xs text-green-300">
              {selectedTool.codeExample}
            </code>
          </pre>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium">
            Documentation
          </button>
          <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium">
            Try Now
          </button>
        </div>

      </div>
    </div>
  </>
)}

    </div>
  );
};

export default ToolMatrix;