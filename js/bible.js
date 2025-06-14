// Global state to store Bible content
window.bibleContent = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded');
    await loadBibleContent();
    setupEventListeners();
});

// Load Bible content from JSON file
async function loadBibleContent() {
    try {
        console.log('Loading Bible content...');
        const response = await fetch('data/bible-content.json');
        if (!response.ok) {
            throw new Error('Failed to load Bible content');
        }
        window.bibleContent = await response.json();
        console.log('Bible content loaded:', window.bibleContent);
        // Initially render Old Testament books
        renderBookList('oldTestament');
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load Bible content. Please try again later.');
    }
}

// Set up event listeners for navigation
function setupEventListeners() {
    console.log('Setting up event listeners');
    const oldTestamentBtn = document.getElementById('oldTestamentBtn');
    const newTestamentBtn = document.getElementById('newTestamentBtn');

    if (oldTestamentBtn) {
        console.log('Old Testament button found');
        oldTestamentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Old Testament button clicked');
            window.renderBookList('oldTestament');
        });
    } else {
        console.warn('Old Testament button not found');
    }

    if (newTestamentBtn) {
        console.log('New Testament button found');
        newTestamentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('New Testament button clicked');
            window.renderBookList('newTestament');
        });
    } else {
        console.warn('New Testament button not found');
    }
}

// Render list of books for Old or New Testament
function renderBookList(testament) {
    console.log('Rendering book list for:', testament);
    const container = document.getElementById('bible-content');
    if (!container) {
        console.error('Bible content container not found');
        return;
    }

    const books = window.bibleContent?.[testament] || [];
    console.log('Books found:', books.length);
    
    container.innerHTML = `
        <div class="section-title">
            <h2>${testament === 'oldTestament' ? 'Old Testament' : 'New Testament'}</h2>
            <p>Select a book to start reading</p>
        </div>
        <div class="book-list">
            ${books.map(book => `
                <div class="book-card" onclick="window.renderChapterList('${testament}', '${book.name}')">
                    <h3>${book.name}</h3>
                    <p>${book.chapters.length} chapters</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Render list of chapters for a specific book
function renderChapterList(testament, bookName) {
    console.log('Rendering chapter list for:', testament, bookName);
    const container = document.getElementById('bible-content');
    if (!container) return;

    const book = window.bibleContent[testament].find(b => b.name === bookName);
    if (!book) return;

    container.innerHTML = `
        <div class="section-title">
            <h2>${book.name}</h2>
            <p>Select a chapter to read</p>
        </div>
        <div class="chapter-list">
            ${book.chapters.map(chapter => `
                <button class="chapter-btn" onclick="window.renderVerseList('${testament}', '${book.name}', ${chapter.chapterNumber})">
                    Chapter ${chapter.chapterNumber}
                </button>
            `).join('')}
        </div>
        <button class="back-btn" onclick="window.renderBookList('${testament}')">
            Back to Books
        </button>
    `;
}

// Render list of verses for a specific chapter
function renderVerseList(testament, bookName, chapterNumber) {
    console.log('Rendering verse list for:', testament, bookName, chapterNumber);
    const container = document.getElementById('bible-content');
    if (!container) return;

    const book = window.bibleContent[testament].find(b => b.name === bookName);
    if (!book) return;

    const chapter = book.chapters.find(c => c.chapterNumber === chapterNumber);
    if (!chapter) return;

    container.innerHTML = `
        <div class="section-title">
            <h2>${book.name} - Chapter ${chapter.chapterNumber}</h2>
        </div>
        <div class="verse-list">
            ${chapter.verses.map(verse => `
                <div class="verse-container">
                    <div class="verse-content">
                        <span class="verse-number">${verse.verseNumber}</span>
                        <p class="verse-text">${verse.text}</p>
                    </div>
                    ${verse.audioUrl ? `
                        <div class="audio-player">
                            <audio controls>
                                <source src="${verse.audioUrl}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        <button class="back-btn" onclick="window.renderChapterList('${testament}', '${book.name}')">
            Back to Chapters
        </button>
    `;
}

// Show error message
function showError(message) {
    console.error('Showing error:', message);
    const container = document.getElementById('bible-content');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// Add functions to window object for onclick handlers
window.renderBookList = renderBookList;
window.renderChapterList = renderChapterList;
window.renderVerseList = renderVerseList;
window.showError = showError;
