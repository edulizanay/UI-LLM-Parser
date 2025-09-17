// Frontend logic for the prompt testing tool

class PromptTester {
    constructor() {
        this.currentSample = null;
        this.currentPrompt = '';
        this.providers = {};
        this.lastResponse = null;

        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
    }

    initializeElements() {
        this.stageSelect = document.getElementById('stage-select');
        this.providerSelect = document.getElementById('provider-select');
        this.modelSelect = document.getElementById('model-select');
        this.sampleSelect = document.getElementById('sample-select');
        this.samplePreview = document.getElementById('sample-preview');
        this.promptEditor = document.getElementById('prompt-editor');
        this.testBtn = document.getElementById('test-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.status = document.getElementById('status');
        this.outputStatus = document.getElementById('output-status');
        this.outputTiming = document.getElementById('output-timing');
        this.outputContent = document.getElementById('output-content');
    }

    bindEvents() {
        this.stageSelect.addEventListener('change', () => this.onStageChange());
        this.providerSelect.addEventListener('change', () => this.onProviderChange());
        this.sampleSelect.addEventListener('change', () => this.onSampleChange());
        this.testBtn.addEventListener('click', () => this.testPrompt());
        this.copyBtn.addEventListener('click', () => this.copyResponse());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!this.testBtn.disabled) {
                    this.testPrompt();
                }
            }
        });

        // Auto-save prompt changes
        this.promptEditor.addEventListener('input', () => {
            this.currentPrompt = this.promptEditor.value;
            this.updateTestButton();
        });
    }

    async loadInitialData() {
        try {
            // Load stages
            const stages = await this.apiCall('/api/stages');
            this.populateSelect(this.stageSelect, stages, 'id', 'name');

            // Load providers
            this.providers = await this.apiCall('/api/providers');
            const providerOptions = Object.keys(this.providers).map(key => ({
                id: key,
                name: this.providers[key].name
            }));
            this.populateSelect(this.providerSelect, providerOptions, 'id', 'name');

        } catch (error) {
            this.showError('Failed to load initial data: ' + error.message);
        }
    }

    async onStageChange() {
        const stage = this.stageSelect.value;
        if (!stage) return;

        try {
            // Load samples for this stage
            const samples = await this.apiCall(`/api/samples/${stage}`);
            const sampleOptions = samples.map(sample => ({
                id: sample.id,
                name: sample.metadata.title,
                data: sample
            }));
            this.populateSelect(this.sampleSelect, sampleOptions, 'id', 'name');

            // Load prompt template
            const promptData = await this.apiCall(`/api/prompts/${stage}`);
            this.promptEditor.value = promptData.content;
            this.currentPrompt = promptData.content;

            this.updateTestButton();

        } catch (error) {
            this.showError('Failed to load stage data: ' + error.message);
        }
    }

    onProviderChange() {
        const provider = this.providerSelect.value;
        if (!provider || !this.providers[provider]) {
            this.modelSelect.innerHTML = '<option value="">Select model...</option>';
            return;
        }

        const models = this.providers[provider].models.map(model => ({
            id: model,
            name: model
        }));
        this.populateSelect(this.modelSelect, models, 'id', 'name');
        this.updateTestButton();
    }

    onSampleChange() {
        const sampleId = this.sampleSelect.value;
        if (!sampleId) {
            this.samplePreview.innerHTML = '<p class="placeholder">Select a sample to see its content</p>';
            this.currentSample = null;
            this.updateTestButton();
            return;
        }

        // Find the selected sample
        const option = this.sampleSelect.options[this.sampleSelect.selectedIndex];
        if (option && option.sampleData) {
            this.currentSample = option.sampleData;
            this.displaySamplePreview(this.currentSample);
            this.updateTestButton();
        }
    }

    displaySamplePreview(sampleData) {
        const sample = sampleData.data;
        const metadata = sampleData.metadata;

        let preview = `
            <div class="sample-info">
                <div class="title">${metadata.title}</div>
                <div class="meta">
                    Source: ${metadata.source} |
                    Messages: ${metadata.messageCount} |
                    Complexity: ${metadata.complexity}
                </div>
            </div>
        `;

        // Display content based on data type
        if (sample.messages) {
            // Tagger sample (NormalizedConversation)
            preview += '<div class="sample-content">';
            preview += `ID: ${sample.id}\nTitle: ${sample.title}\nMessages:\n\n`;
            sample.messages.slice(0, 3).forEach((msg, i) => {
                preview += `${i + 1}. ${msg.role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n\n`;
            });
            if (sample.messages.length > 3) {
                preview += `... and ${sample.messages.length - 3} more messages`;
            }
            preview += '</div>';
        } else if (sample.tags) {
            // Parser sample (TaggedConversation)
            preview += '<div class="sample-content">';
            preview += `ID: ${sample.id}\nTitle: ${sample.title}\nTags: [${sample.tags.join(', ')}]\nSource: ${sample.source}\nMessage Count: ${sample.message_count}`;
            preview += '</div>';
        } else if (sample.summary) {
            // Reconciler sample (ParsedEntry)
            preview += '<div class="sample-content">';
            preview += `ID: ${sample.conversation_id}\nCategory: ${sample.category}\nSummary: ${sample.summary}\n\nEntities:\n${JSON.stringify(sample.entities, null, 2)}`;
            preview += '</div>';
        }

        this.samplePreview.innerHTML = preview;
    }

    updateTestButton() {
        const canTest = this.stageSelect.value &&
                       this.providerSelect.value &&
                       this.modelSelect.value &&
                       this.currentSample &&
                       this.currentPrompt.trim();

        this.testBtn.disabled = !canTest;
    }

    async testPrompt() {
        if (this.testBtn.disabled) return;

        this.setLoading(true);

        try {
            const requestData = {
                stage: this.stageSelect.value,
                provider: this.providerSelect.value,
                model: this.modelSelect.value,
                prompt: this.currentPrompt,
                sampleData: this.currentSample.data
            };

            const response = await this.apiCall('/api/test-prompt', 'POST', requestData);

            this.lastResponse = response.response;

            if (response.success) {
                this.outputStatus.textContent = '✅ Success';
                this.outputStatus.className = 'output-status success';
                this.outputTiming.textContent = `${response.timing}ms (${response.tokenCount || '?'} tokens)`;
                this.outputContent.textContent = response.response;
                this.copyBtn.disabled = false;
                this.showStatus('Test completed successfully!', 'success');
            } else {
                throw new Error(response.error);
            }

        } catch (error) {
            this.outputStatus.textContent = '❌ Error';
            this.outputStatus.className = 'output-status error';
            this.outputContent.textContent = `Error: ${error.message}`;
            this.copyBtn.disabled = true;
            this.showError('Test failed: ' + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    copyResponse() {
        if (this.lastResponse) {
            navigator.clipboard.writeText(this.lastResponse)
                .then(() => this.showStatus('Response copied to clipboard!', 'success'))
                .catch(() => this.showError('Failed to copy to clipboard'));
        }
    }

    setLoading(loading) {
        this.testBtn.disabled = loading;

        if (loading) {
            this.testBtn.textContent = '⏳ Testing...';
            this.outputStatus.textContent = '⏳ Testing...';
            this.outputStatus.className = 'output-status loading';
            this.outputContent.textContent = 'Making API call...';
            this.showStatus('Testing prompt...', 'loading');
        } else {
            this.testBtn.textContent = '🚀 Test Prompt';
            this.updateTestButton();
        }
    }

    showStatus(message, type = '') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;

        if (type) {
            setTimeout(() => {
                this.status.textContent = '';
                this.status.className = 'status';
            }, 3000);
        }
    }

    showError(message) {
        this.showStatus(message, 'error');
        console.error(message);
    }

    populateSelect(selectElement, options, valueKey, textKey) {
        selectElement.innerHTML = '<option value="">Select...</option>';

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option[valueKey];
            optionElement.textContent = option[textKey];

            // Store data for samples
            if (option.data) {
                optionElement.sampleData = option.data;
            }

            selectElement.appendChild(optionElement);
        });
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(endpoint, options);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PromptTester();
});

// Add keyboard shortcut hint
document.addEventListener('DOMContentLoaded', () => {
    const hint = document.createElement('div');
    hint.className = 'shortcut-hint';
    hint.textContent = 'Ctrl+Enter to test';
    document.body.appendChild(hint);

    // Show hint briefly on load
    setTimeout(() => hint.classList.add('show'), 1000);
    setTimeout(() => hint.classList.remove('show'), 4000);
});