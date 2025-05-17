/**
 * OS冒險者：作業系統互動學習遊戲
 * 核心遊戲邏輯與互動機制
 */

// 遊戲核心類別
class OSAdventureGame {
    constructor() {
        // 遊戲狀態初始化
        this.state = {
            currentChapter: 0,
            currentScene: 0,
            score: 0,
            lives: 3,
            timeElapsed: 0,
            character: {
                name: "系統管理員",
                level: 1,
                exp: 0,
                role: "新手冒險者",
                skills: []
            },
            inventory: [],
            flags: {
                hasCompletedResourceManagement: false,
                hasCompletedFileSystem: false,
                hasCompletedMultitasking: false,
                hasCompletedUserInterface: false
            }
        };
        
        // 計時器
        this.timer = null;
        
        // DOM元素快取
        this.elements = {
            sceneAnimation: document.getElementById('scene-animation'),
            sceneText: document.getElementById('scene-text'),
            sceneChoices: document.getElementById('scene-choices'),
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            time: document.getElementById('time'),
            characterName: document.getElementById('character-name'),
            characterRole: document.getElementById('character-role'),
            characterLevel: document.getElementById('character-level'),
            characterExp: document.getElementById('character-exp'),
            inventoryItems: document.getElementById('inventory-items')
        };
        
        // 遊戲內容數據結構
        this.chapters = this.initializeGameContent();
        
        // 初始化遊戲
        this.init();
    }
    
    // 初始化遊戲
    init() {
        this.loadProgress();
        this.startTimer();
        this.renderChapter();
        this.updateStats();
        
        // 註冊全局事件監聽器
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    // 開始計時器
    startTimer() {
        this.timer = setInterval(() => {
            this.state.timeElapsed++;
            this.updateTime();
        }, 1000);
    }
    
    // 更新時間顯示
    updateTime() {
        const minutes = Math.floor(this.state.timeElapsed / 60);
        const seconds = this.state.timeElapsed % 60;
        this.elements.time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // 渲染當前章節和場景
    renderChapter() {
        const chapter = this.chapters[this.state.currentChapter];
        const scene = chapter.scenes[this.state.currentScene];
        
        // 更新標題
        document.getElementById('game-title').textContent = `OS冒險者：${chapter.title}`;
        
        // 更新場景文字
        this.elements.sceneText.innerHTML = '';
        this.elements.sceneText.classList.add('fade-in');
        
        // 逐字顯示文本效果
        this.typeWriter(scene.text, this.elements.sceneText, 0, 20);
        
        // 創建動畫
        this.createAnimation(scene.animation);
        
        // 渲染選項
        setTimeout(() => {
            this.renderChoices(scene.choices);
        }, scene.text.length * 20 + 500); // 等待文字顯示完成後再顯示選項
    }
    
    // 逐字顯示文本效果
    typeWriter(text, element, index, speed) {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            setTimeout(() => this.typeWriter(text, element, index + 1, speed), speed);
        }
    }
    
    // 渲染選項
    renderChoices(choices) {
        this.elements.sceneChoices.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn slide-in';
            button.style.animationDelay = `${index * 0.1}s`;
            
            // 添加圖標
            const icon = document.createElement('i');
            icon.className = this.getChoiceIcon(choice);
            button.appendChild(icon);
            
            // 添加文字
            const span = document.createElement('span');
            span.textContent = choice.text;
            button.appendChild(span);
            
            // 添加點擊事件
            button.addEventListener('click', () => this.handleChoice(choice));
            
            this.elements.sceneChoices.appendChild(button);
        });
    }
    
    // 根據選項類型獲取圖標
    getChoiceIcon(choice) {
        if (choice.action) {
            return 'fas fa-gamepad';
        } else if (choice.nextChapter !== undefined) {
            return 'fas fa-book';
        } else {
            return 'fas fa-arrow-right';
        }
    }
    
    // 處理選項點擊
    handleChoice(choice) {
        // 播放點擊音效
        this.playSound('click');
        
        // 增加分數
        this.addScore(10);
        
        // 處理特殊動作
        if (choice.action) {
            this[choice.action]();
        }
        
        // 切換章節或場景
        if (choice.nextChapter !== undefined) {
            this.state.currentChapter = choice.nextChapter;
            this.state.currentScene = choice.nextScene || 0;
        } else if (choice.nextScene !== undefined) {
            this.state.currentScene = choice.nextScene;
        }
        
        // 渲染新場景
        this.renderChapter();
        
        // 保存進度
        this.saveProgress();
    }
    
    // 創建動畫
    createAnimation(animationType) {
        this.elements.sceneAnimation.innerHTML = '';
        this.elements.sceneAnimation.className = 'scene-animation';
        
        switch (animationType) {
            case 'resource_intro':
                this.createResourceIntroAnimation();
                break;
            case 'cpu_management':
                this.createCPUAnimation();
                break;
            case 'memory_management':
                this.createMemoryAnimation();
                break;
            case 'filesystem_intro':
                this.createFileSystemAnimation();
                break;
            case 'directory_structure':
                this.createDirectoryAnimation();
                break;
            case 'multitasking_intro':
                this.createMultitaskingAnimation();
                break;
            case 'ui_intro':
                this.createUIAnimation();
                break;
            case 'gui_interface':
                this.createGUIAnimation();
                break;
            case 'cli_interface':
                this.createCLIAnimation();
                break;
            default:
                this.createDefaultAnimation();
                break;
        }
    }
    
    // 資源管理介紹動畫
    createResourceIntroAnimation() {
        const container = this.elements.sceneAnimation;
        container.style.background = '#f8f9fa';
        
        // 創建CPU圖示
        const cpu = document.createElement('div');
        cpu.className = 'cpu-container pulse';
        cpu.style.left = '50%';
        cpu.style.top = '30%';
        cpu.style.transform = 'translate(-50%, -50%)';
        cpu.textContent = 'CPU';
        container.appendChild(cpu);
        
        // 創建記憶體圖示
        const memory = document.createElement('div');
        memory.className = 'memory-block';
        memory.style.left = '20%';
        memory.style.top = '60%';
        memory.style.width = '60%';
        memory.style.height = '40px';
        memory.textContent = '記憶體';
        container.appendChild(memory);
        
        // 創建程序圖示
        const processes = ['P1', 'P2', 'P3'];
        processes.forEach((proc, index) => {
            const process = document.createElement('div');
            process.className = 'process-icon';
            process.style.left = `${20 + index * 30}%`;
            process.style.top = '20%';
            process.textContent = proc;
            
            // 添加動畫
            setTimeout(() => {
                process.style.top = '40%';
                setTimeout(() => {
                    process.style.top = '20%';
                }, 1000);
            }, index * 1500);
            
            container.appendChild(process);
        });
    }
    
    // CPU管理動畫
    createCPUAnimation() {
        const container = this.elements.sceneAnimation;
        container.style.background = '#f0f8ff';
        
        // 創建CPU圖示
        const cpu = document.createElement('div');
        cpu.className = 'cpu-container';
        cpu.style.left = '50%';
        cpu.style.top = '40%';
        cpu.style.transform = 'translate(-50%, -50%)';
        cpu.style.width = '120px';
        cpu.style.height = '120px';
        cpu.textContent = 'CPU';
        container.appendChild(cpu);
        
        // 創建排程演算法選擇器
        const algorithms = ['FCFS', 'SJF', 'RR'];
        const algoContainer = document.createElement('div');
        algoContainer.style.position = 'absolute';
        algoContainer.style.top = '10px';
        algoContainer.style.left = '0';
        algoContainer.style.width = '100%';
        algoContainer.style.display = 'flex';
        algoContainer.style.justifyContent = 'center';
        algoContainer.style.gap = '10px';
        
        algorithms.forEach(algo => {
            const btn = document.createElement('button');
            btn.textContent = algo;
            btn.style.padding = '5px 10px';
            btn.style.borderRadius = '5px';
            btn.style.border = 'none';
            btn.style.background = '#3498db';
            btn.style.color = 'white';
            btn.style.cursor = 'pointer';
            
            btn.addEventListener('click', () => {
                // 切換選中狀態
                algoContainer.querySelectorAll('button').forEach(b => {
                    b.style.background = '#3498db';
                });
                btn.style.background = '#2c3e50';
                
                // 更新CPU動畫
                this.updateCPUScheduling(algo);
            });
            
            algoContainer.appendChild(btn);
        });
        
        container.appendChild(algoContainer);
        
        // 創建程序
        const processes = [
            { id: 'P1', burstTime: 6, priority: 2, color: '#e74c3c' },
            { id: 'P2', burstTime: 3, priority: 1, color: '#2ecc71' },
            { id: 'P3', burstTime: 8, priority: 3, color: '#f39c12' },
            { id: 'P4', burstTime: 2, priority: 2, color: '#9b59b6' }
        ];
        
        const processContainer = document.createElement('div');
        processContainer.style.position = 'absolute';
        processContainer.style.bottom = '20px';
        processContainer.style.left = '0';
        processContainer.style.width = '100%';
        processContainer.style.display = 'flex';
        processContainer.style.justifyContent = 'center';
        processContainer.style.gap = '15px';
        
        processes.forEach(proc => {
            const process = document.createElement('div');
            process.className = 'process-icon';
            process.style.position = 'relative';
            process.style.background = proc.color;
            process.textContent = proc.id;
            process.setAttribute('data-burst', proc.burstTime);
            process.setAttribute('data-priority', proc.priority);
            
            // 添加提示信息
            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.top = '-30px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.background = '#2c3e50';
            tooltip.style.color = 'white';
            tooltip.style.padding = '3px 6px';
            tooltip.style.borderRadius = '3px';
            tooltip.style.fontSize = '12px';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s';
            tooltip.textContent = `Burst: ${proc.burstTime}, Priority: ${proc.priority}`;
            
            process.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });
            
            process.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
            
            process.appendChild(tooltip);
            processContainer.appendChild(process);
        });
        
        container.appendChild(processContainer);
    }
    
    // 更新CPU排程動畫
    updateCPUScheduling(algorithm) {
        const container = this.elements.sceneAnimation;
        const processes = Array.from(container.querySelectorAll('.process-icon')).filter(p => !p.parentElement.classList.contains('cpu-container'));
        const cpu = container.querySelector('.cpu-container');
        
        // 清除CPU中的程序
        while (cpu.firstChild) {
            if (cpu.firstChild.classList && cpu.firstChild.classList.contains('process-icon')) {
                cpu.removeChild(cpu.firstChild);
            } else {
                break;
            }
        }
        
        // 根據不同算法排序程序
        let sortedProcesses;
        switch (algorithm) {
            case 'FCFS': // 先到先服務
                sortedProcesses = [...processes];
                break;
            case 'SJF': // 最短工作優先
                sortedProcesses = [...processes].sort((a, b) => {
                    return parseInt(a.getAttribute('data-burst')) - parseInt(b.getAttribute('data-burst'));
                });
                break;
            case 'RR': // 輪流調度
                sortedProcesses = [...processes];
                // 實際上RR需要更複雜的動畫，這裡簡化處理
                break;
            default:
                sortedProcesses = [...processes];
        }
        
        // 動畫顯示排程過程
        sortedProcesses.forEach((proc, index) => {
            setTimeout(() => {
                // 複製程序到CPU
                const processCopy = proc.cloneNode(true);
                processCopy.style.position = 'absolute';
                processCopy.style.left = '50%';
                processCopy.style.top = '50%';
                processCopy.style.transform = 'translate(-50%, -50%)';
                processCopy.style.width = '40px';
                processCopy.style.height = '40px';
                cpu.appendChild(processCopy);
                
                // 原程序變暗
                proc.style.opacity = '0.5';
                
                // 顯示執行時間
                const burstTime = parseInt(proc.getAttribute('data-burst'));
                const timeDisplay = document.createElement('div');
                timeDisplay.style.position = 'absolute';
                timeDisplay.style.top = '-30px';
                timeDisplay.style.left = '50%';
                timeDisplay.style.transform = 'translateX(-50%)';
                timeDisplay.style.color = 'white';
                timeDisplay.style.background = '#2c3e50';
                timeDisplay.style.padding = '3px 6px';
                timeDisplay.style.borderRadius = '3px';
                timeDisplay.textContent = `執行中: ${burstTime}秒`;
                cpu.appendChild(timeDisplay);
                
                // 執行完成後移除
                setTimeout(() => {
                    cpu.removeChild(processCopy);
                    if (timeDisplay.parentNode === cpu) {
                        cpu.removeChild(timeDisplay);
                    }
                    proc.style.opacity = '0.2'; // 執行完成的程序變更暗
                }, burstTime * 1000);
                
            }, index * 3000); // 每個程序間隔3秒
        });
        
        // 5秒後重置動畫
        setTimeout(() => {
            processes.forEach(proc => {
                proc.style.opacity = '1';
            });
        }, sortedProcesses.length * 3000 + 2000);
    }
    
    // 記憶體管理動畫
    createMemoryAnimation() {
        const container = this.elements.sceneAnimation;
        container.style.background = '#f0f8ff';
        
        // 創建記憶體區塊
        const memoryContainer = document.createElement('div');
        memoryContainer.style.position = 'absolute';
        memoryContainer.style.left = '50%';
        memoryContainer.style.top = '50%';
        memoryContainer.style.transform = 'translate(-50%, -50%)';
        memoryContainer.style.width = '80%';
        memoryContainer.style.height = '60%';
        memoryContainer.style.border = '2px solid #3498db';
        memoryContainer.style.borderRadius = '10px';
        memoryContainer.style.background = 'white';
        memoryContainer.style.display = 'flex';
        memoryContainer.style.flexDirection = 'column';
        memoryContainer.style.overflow = 'hidden';
        
        // 創建記憶體標題
        const memoryTitle = document.createElement('div');
        memoryTitle.style.padding = '5px';
        memoryTitle.style.background = '#3498db';
        memoryTitle.style.color = 'white';
        memoryTitle.style.textAlign = 'center';
        memoryTitle.textContent = '記憶體管理';
        memoryContainer.appendChild(memoryTitle);
        
        // 創建記憶體區塊
        const memoryBlocks = document.createElement('div');
        memoryBlocks.style.flex = '1';
        memoryBlocks.style.display = 'flex';
        memoryBlocks.style.flexDirection = 'column';
        memoryBlocks.style.padding = '10px';
        memoryBlocks.style.gap = '5px';
        
        // 初始空閒區塊
        const freeBlock = document.createElement('div');
        freeBlock.className = 'memory-block';
        freeBlock.style.position = 'relative';
        freeBlock.style.width = '100%';
        freeBlock.style.height = '100%';
        freeBlock.style.background = '#ecf0f1';
        freeBlock.style.display = 'flex';
        freeBlock.style.alignItems = 'center';
        freeBlock.style.justifyContent = 'center';
        freeBlock.textContent = '空閒記憶體 (100%)';
        memoryBlocks.appendChild(freeBlock);
        
        memoryContainer.appendChild(memoryBlocks);
        container.appendChild(memoryContainer);
        
        // 創建程序按鈕
        const processButtons = document.createElement('div');
        processButtons.style.position = 'absolute';
        processButtons.style.bottom = '10px';
        processButtons.style.left = '0';
        processButtons.style.width = '100%';
        processButtons.style.display = 'flex';
        processButtons.style.justifyContent = 'center';
        processButtons.style.gap = '10px';
        
        const processes = [
            { id: 'P1', size: 20, color: '#e74c3c' },
            { id: 'P2', size: 30, color: '#2ecc71' },
            { id: 'P3', size: 15, color: '#f39c12' },
            { id: 'P4', size: 25, color: '#9b59b6' }
        ];
        
        processes.forEach(proc => {
            const btn = document.createElement('button');
            btn.textContent = `${proc.id} (${proc.size}MB)`;
            btn.style.padding = '5px 10px';
            btn.style.borderRadius = '5px';
            btn.style.border = 'none';
            btn.style.background = proc.color;
            btn.style.color = 'white';
            btn.style.cursor = 'pointer';
            
            btn.addEventListener('click', () => {
                this.allocateMemory(memoryBlocks, proc);
            });
            
            processButtons.appendChild(btn);
        });
        
        // 添加釋放記憶體按鈕
        const releaseBtn = document.createElement('button');
        releaseBtn.textContent = '釋放記憶體';
        releaseBtn.style.padding = '5px 10px';
        releaseBtn.style.borderRadius = '5px';
        releaseBtn.style.border = 'none';
        releaseBtn.style.background = '#34495e';
        releaseBtn.style.color = 'white';
        releaseBtn.style.cursor = 'pointer';
        
        releaseBtn.addEventListener('click', () => {
            this.releaseMemory(memoryBlocks);
        });
        
        processButtons.appendChild(releaseBtn);
        container.appendChild(processButtons);
    }
    
    // 分配記憶體
    allocateMemory(memoryBlocks, process) {
        // 查找空閒區塊
        const freeBlocks = Array.from(memoryBlocks.querySelectorAll('.memory-block')).filter(block => 
            block.textContent.includes('空閒記憶體')
        );
        
        if (freeBlocks.length === 0) {
            alert('沒有足夠的記憶體空間！');
            return;
        }
        
        // 簡單起見，只使用第一個空閒區塊
        const freeBlock = freeBlocks[0];
        const freeSize = parseInt(freeBlock.textContent.match(/\d+/)[0]);
        
        if (freeSize < process.size) {
            alert('空閒記憶體不足！');
            return;
        }
        
        // 分割空閒區塊
        const remainingSize = freeSize - process.size;
        
        // 創建程序區塊
        const processBlock = document.createElement('div');
        processBlock.className = 'memory-block';
        processBlock.style.position = 'relative';
        processBlock.style.width = '100%';
        processBlock.style.height = `${process.size}%`;
        processBlock.style.background = process.color;
        processBlock.style.display = 'flex';
        processBlock.style.alignItems = 'center';
        processBlock.style.justifyContent = 'center';
        processBlock.style.color = 'white';
        processBlock.textContent = `${process.id} (${process.size}MB)`;
        
        // 更新或創建剩餘空閒區塊
        if (remainingSize > 0) {
            freeBlock.style.height = `${remainingSize}%`;
            freeBlock.textContent = `空閒記憶體 (${remainingSize}%)`;
            memoryBlocks.insertBefore(processBlock, freeBlock);
        } else {
            // 完全替換空閒區塊
            memoryBlocks.replaceChild(processBlock, freeBlock);
        }
    }
    
    // 釋放記憶體
    releaseMemory(memoryBlocks) {
        // 獲取所有非空閒區塊
        const processBlocks = Array.from(memoryBlocks.querySelectorAll('.memory-block')).filter(block => 
            !block.textContent.includes('空閒記憶體')
        );
        
        if (processBlocks.length === 0) {
            alert('沒有程序在記憶體中！');
            return;
        }
        
        // 隨機選擇一個程序釋放
        const randomIndex = Math.floor(Math.random() * processBlocks.length);
        const blockToRelease = processBlocks[randomIndex];
        
        // 獲取程序大小
        const size = parseInt(blockToRelease.textContent.match(/\d+/)[0]);
        
        // 創建新的空閒區塊
        const newFreeBlock = document.createElement('div');
        newFreeBlock.className = 'memory-block';
        newFreeBlock.style.position = 'relative';
        newFreeBlock.style.width = '100%';
        newFreeBlock.style.height = blockToRelease.style.height;
        newFreeBlock.style.background = '#ecf0f1';
        newFreeBlock.style.display = 'flex';
        newFreeBlock.style.alignItems = 'center';
        newFreeBlock.style.justifyContent = 'center';
        newFreeBlock.textContent = `空閒記憶體 (${size}%)`;
        
        // 替換區塊
        memoryBlocks.replaceChild(newFreeBlock, blockToRelease);
        
        // 合併相鄰的空閒區塊 (簡化版)
        this.mergeAdjacentFreeBlocks(memoryBlocks);
    }
    
    // 合併相鄰的空閒區塊
    mergeAdjacentFreeBlocks(memoryBlocks) {
        const blocks = Array.from(memoryBlocks.querySelectorAll('.memory-block'));
        
        for (let i = 0; i < blocks.length - 1; i++) {
            const currentBlock = blocks[i];
            const nextBlock = blocks[i + 1];
            
            if (currentBlock.textContent.includes('空閒記憶體') && nextBlock.textContent.includes('空閒記憶體')) {
                // 獲取兩個區塊的大小
                const currentSize = parseInt(currentBlock.textContent.match(/\d+/)[0]);
                const nextSize = parseInt(nextBlock.textContent.match(/\d+/)[0]);
                const totalSize = currentSize + nextSize;
                
                // 更新當前區塊
                currentBlock.style.height = `${totalSize}%`;
                currentBlock.textContent = `空閒記憶體 (${totalSize}%)`;
                
                // 移除下一個區塊
                memoryBlocks.removeChild(nextBlock);
                
                // 更新blocks數組，避免跳過合併後的下一個元素
                blocks.splice(i + 1, 1);
                i--; // 重新檢查當前位置，以防有多個連續的空閒區塊
            }
        }
    }
    
    // 檔案系統動畫
    createFileSystemAnimation() {
        const container = this.elements.sceneAnimation;
        container.style.background = 'white';
        
        // 創建檔案系統視窗
        const fileExplorer = document.createElement('div');
        fileExplorer.className = 'file-explorer';
        
        // 創建標題欄
        const header = document.createElement('div');
        header.className = 'file-explorer-header';
        header.textContent = '檔案總管';
        fileExplorer.appendChild(header);
        
        // 創建內容區域
        const content = document.createElement('div');
        content.className = 'file-explorer-content';
        
        // 創建側邊欄
        const sidebar = document.createElement('div');
        sidebar.className = 'file-explorer-sidebar';
        
        const folders = ['文件', '圖片', '音樂', '影片', '下載'];
        folders.forEach(folder => {
            const folderItem = document.createElement('div');
            folderItem.style.padding = '5px';
            folderItem.style.cursor = 'pointer';
            folderItem.style.display = 'flex';
            folderItem.style.alignItems = 'center';
            folderItem.style.gap = '5px';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-folder';
            icon.style.color = '#f39c12';
            
            const text = document.createElement('span');
            text.textContent = folder;
            
            folderItem.appendChild(icon);
            folderItem.appendChild(text);
            
            folderItem.addEventListener('mouseenter', () => {
                folderItem.style.background = '#e9ecef';
            });
            
            folderItem.addEventListener('mouseleave', () => {
                folderItem.style.background = 'transparent';
            });
            
            sidebar.appendChild(folderItem);
        });
        
        content.appendChild(sidebar);
        
        // 創建主內容區
        const main = document.createElement('div');
        main.className = 'file-explorer-main';
        
        const files = [
            { name: '報告.txt', type: 'txt', icon: 'fas fa-file-alt', color: '#3498db' },
            { name: '照片.gif', type: 'gif', icon: 'fas fa-file-image', color: '#e74c3c' },
            { name: '文件.doc', type: 'doc', icon: 'fas fa-file-word', color: '#2980b9' },
            { name: '表格.tab', type: 'tab', icon: 'fas fa-file-excel', color: '#27ae60' },
            { name: '程式.exe', type: 'exe', icon: 'fas fa-file-code', color: '#8e44ad' },
            { name: '音樂.mp3', type: 'mp3', icon: 'fas fa-file-audio', color: '#f1c40f' }
        ];
        
        files.forEach(file => {
            const fileIcon = document.createElement('div');
            fileIcon.className = 'file-icon';
            
            const icon = document.createElement('i');
            icon.className = file.icon;
            icon.style.color = file.color;
            
            const name = document.createElement('div');
            name.className = 'file-name';
            name.textContent = file.name;
            
            fileIcon.appendChild(icon);
            fileIcon.appendChild(name);
            
            fileIcon.addEventListener('click', () => {
                this.showFileInfo(file);
            });
            
            main.appendChild(fileIcon);
        });
        
        content.appendChild(main);
        fileExplorer.appendChild(content);
        container.appendChild(fileExplorer);
    }
    
    // 顯示檔案信息
    showFileInfo(file) {
        const container = this.elements.sceneAnimation;
        
        // 創建檔案信息視窗
        const infoWindow = document.createElement('div');
        infoWindow.style.position = 'absolute';
        infoWindow.style.top = '50%';
        infoWindow.style.left = '50%';
        infoWindow.style.transform = 'translate(-50%, -50%)';
        infoWindow.style.width = '300px';
        infoWindow.style.background = 'white';
        infoWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        infoWindow.style.borderRadius = '5px';
        infoWindow.style.zIndex = '100';
        
        // 創建標題欄
        const header = document.createElement('div');
        header.style.background = '#3498db';
        header.style.color = 'white';
        header.style.padding = '10px';
        header.style.borderTopLeftRadius = '5px';
        header.style.borderTopRightRadius = '5px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        
        const title = document.createElement('div');
        title.textContent = '檔案資訊';
        
        const closeBtn = document.createElement('div');
        closeBtn.textContent = '×';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '20px';
        
        closeBtn.addEventListener('click', () => {
            container.removeChild(infoWindow);
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        infoWindow.appendChild(header);
        
        // 創建內容
        const content = document.createElement('div');
        content.style.padding = '15px';
        
        const fileInfo = [
            { label: '檔案名稱', value: file.name },
            { label: '檔案類型', value: `.${file.type}` },
            { label: '大小', value: `${Math.floor(Math.random() * 1000) + 10} KB` },
            { label: '建立日期', value: '2025-05-15 14:30:22' },
            { label: '修改日期', value: '2025-05-17 09:45:18' }
        ];
        
        fileInfo.forEach(info => {
            const row = document.createElement('div');
            row.style.marginBottom = '10px';
            row.style.display = 'flex';
            
            const label = document.createElement('div');
            label.style.width = '100px';
            label.style.fontWeight = 'bold';
            label.textContent = `${info.label}:`;
            
            const value = document.createElement('div');
            value.style.flex = '1';
            value.textContent = info.value;
            
            row.appendChild(label);
            row.appendChild(value);
            content.appendChild(row);
        });
        
        // 添加檔案操作按鈕
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.justifyContent = 'center';
        actions.style.gap = '10px';
        actions.style.marginTop = '15px';
        
        const operations = ['開啟', '複製', '刪除'];
        operations.forEach(op => {
            const btn = document.createElement('button');
            btn.textContent = op;
            btn.style.padding = '5px 15px';
            btn.style.border = 'none';
            btn.style.borderRadius = '3px';
            btn.style.background = '#3498db';
            btn.style.color = 'white';
            btn.style.cursor = 'pointer';
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#2980b9';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#3498db';
            });
            
            btn.addEventListener('click', () => {
                alert(`已${op}檔案: ${file.name}`);
                container.removeChild(infoWindow);
            });
            
            actions.appendChild(btn);
        });
        
        content.appendChild(actions);
        infoWindow.appendChild(content);
        container.appendChild(infoWindow);
    }
    
    // 目錄結構動畫
    createDirectoryAnimation() {
        const container = this.elements.sceneAnimation;
        container.style.background = 'white';
        
        // 創建目錄樹視圖
        const treeView = document.createElement('div');
        treeView.style.position = 'absolute';
        treeView.style.left = '50%';
        treeView.style.top = '50%';
        treeView.style.transform = 'translate(-50%, -50%)';
        treeView.style.width = '80%';
        treeView.style.height = '80%';
        treeView.style.background = 'white';
        treeView.style.border = '1px solid #ddd';
        treeView.style.borderRadius = '5px';
        treeView.style.overflow = 'auto';
        treeView.style.padding = '10px';
        
        // 創建根目錄
        const rootDir = this.createDirectoryNode('根目錄 (C:)', true);
        
        // 創建子目錄
        const subDirs = [
            { name: '系統', children: ['Windows', 'Program Files', 'Users'] },
            { name: '文件', children: ['報告', '筆記', '照片'] },
            { name: '應用程式', children: ['遊戲', '工具', '瀏覽器'] }
        ];
        
        subDirs.forEach(dir => {
            const subDir = this.createDirectoryNode(dir.name, true);
            
            dir.children.forEach(child => {
                const childNode = this.createDirectoryNode(child, false);
                subDir.appendChild(childNode);
            });
            
            rootDir.appendChild(subDir);
        });
        
        treeView.appendChild(rootDir);
        container.appendChild(treeView);
        
        // 添加說明文字
        const instruction = document.createElement('div');
        instruction.style.position = 'absolute';
        instruction.style.bottom = '10px';
        instruction.style.left = '0';
        instruction.style.width = '100%';
        instruction.style.textAlign = 'center';
        instruction.textContent = '點擊資料夾展開或收起';
        container.appendChild(instruction);
    }
    
    // 創建目錄節點
    createDirectoryNode(name, isExpandable) {
        const node = document.createElement('div');
        node.style.marginLeft = '20px';
        node.style.marginBottom = '5px';
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '5px';
        header.style.cursor = isExpandable ? 'pointer' : 'default';
        
        const icon = document.createElement('i');
        icon.className = isExpandable ? 'fas fa-folder' : 'fas fa-file';
        icon.style.color = isExpandable ? '#f39c12' : '#3498db';
        
        const text = document.createElement('span');
        text.textContent = name;
        
        header.appendChild(icon);
        header.appendChild(text);
        node.appendChild(header);
        
        if (isExpandable) {
            const childContainer = document.createElement('div');
            childContainer.style.display = 'none';
            node.appendChild(childContainer);
            
            header.addEventListener('click', () => {
                const isExpanded = childContainer.style.display !== 'none';
                childContainer.style.display = isExpanded ? 'none' : 'block';
                icon.className = isExpanded ? 'fas fa-folder' : 'fas fa-folder-open';
            });
        }
        
        return node;
    }
    
    // 多工處理動畫
    createMultitaskingAnimation() {
        const container = this.elements.sceneAnimation;
        container.style.background = '#f8f9fa';
        
        // 創建多工處理視窗
        const multitaskingContainer = document.createElement('div');
        multitaskingContainer.className = 'multitasking-container';
        
        // 創建任務欄
        const taskBar = document.createElement('div');
        taskBar.className = 'task-bar';
        
        const tasks = ['文件編輯器', '瀏覽器', '音樂播放器', '計算機'];
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.textContent = task;
            
            taskItem.addEventListener('click', () => {
                this.createWindow(task, multitaskingContainer);
            });
            
            taskBar.appendChild(taskItem);
        });
        
        multitaskingContainer.appendChild(taskBar);
        container.appendChild(multitaskingContainer);
        
        // 預設創建兩個視窗
        setTimeout(() => {
            this.createWindow('文件編輯器', multitaskingContainer);
        }, 500);
        
        setTimeout(() => {
            this.createWindow('瀏覽器', multitaskingContainer);
        }, 1500);
    }
    
    // 創建視窗
    createWindow(title, container) {
        const window = document.createElement('div');
        window.className = 'window';
        window.style.left = `${Math.random() * 30 + 10}%`;
        window.style.top = `${Math.random() * 30 + 10}%`;
        
        // 創建視窗標題欄
        const header = document.createElement('div');
        header.className = 'window-header';
        
        const windowTitle = document.createElement('div');
        windowTitle.className = 'window-title';
        windowTitle.textContent = title;
        
        const controls = document.createElement('div');
        controls.className = 'window-controls';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'window-control window-close';
        closeBtn.addEventListener('click', () => {
            container.removeChild(window);
        });
        
        const minimizeBtn = document.createElement('div');
        minimizeBtn.className = 'window-control window-minimize';
        
        const maximizeBtn = document.createElement('div');
        maximizeBtn.className = 'window-control window-maximize';
        
        controls.appendChild(minimizeBtn);
        controls.appendChild(maximizeBtn);
        controls.appendChild(closeBtn);
        
        header.appendChild(windowTitle);
        header.appendChild(controls);
        
        // 拖曳功能
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - window.getBoundingClientRect().left;
            offsetY = e.clientY - window.getBoundingClientRect().top;
            
            // 將當前視窗置於頂層
            Array.from(container.querySelectorAll('.window')).forEach(w => {
                w.style.zIndex = '1';
            });
            window.style.zIndex = '2';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                
                // 確保視窗不會被拖出容器
                const containerRect = container.getBoundingClientRect();
                const maxX = containerRect.width - window.offsetWidth;
                const maxY = containerRect.height - window.offsetHeight;
                
                window.style.left = `${Math.max(0, Math.min(x - containerRect.left, maxX))}px`;
                window.style.top = `${Math.max(0, Math.min(y - containerRect.top, maxY))}px`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // 創建視窗內容
        const content = document.createElement('div');
        content.className = 'window-content';
        
        // 根據不同應用顯示不同內容
        switch (title) {
            case '文件編輯器':
                const textarea = document.createElement('textarea');
                textarea.style.width = '100%';
                textarea.style.height = '100%';
                textarea.style.border = 'none';
                textarea.style.resize = 'none';
                textarea.style.outline = 'none';
                textarea.value = '這是一個文件編輯器視窗。\n\n在多工處理環境中，你可以同時開啟多個應用程式。';
                content.appendChild(textarea);
                break;
                
            case '瀏覽器':
                const browser = document.createElement('div');
                browser.style.width = '100%';
                browser.style.height = '100%';
                browser.style.display = 'flex';
                browser.style.flexDirection = 'column';
                
                const addressBar = document.createElement('div');
                addressBar.style.padding = '5px';
                addressBar.style.background = '#f8f9fa';
                addressBar.style.borderBottom = '1px solid #ddd';
                
                const address = document.createElement('input');
                address.type = 'text';
                address.value = 'https://www.example.com';
                address.style.width = '100%';
                address.style.padding = '3px';
                addressBar.appendChild(address);
                
                const webpage = document.createElement('div');
                webpage.style.flex = '1';
                webpage.style.padding = '10px';
                webpage.style.overflow = 'auto';
                webpage.innerHTML = '<h2>歡迎使用瀏覽器</h2><p>這是一個模擬的網頁內容。在多工處理環境中，瀏覽器是常用的應用程式之一。</p>';
                
                browser.appendChild(addressBar);
                browser.appendChild(webpage);
                content.appendChild(browser);
                break;
                
            case '音樂播放器':
                const player = document.createElement('div');
                player.style.width = '100%';
                player.style.height = '100%';
                player.style.display = 'flex';
                player.style.flexDirection = 'column';
                player.style.alignItems = 'center';
                player.style.justifyContent = 'center';
                
                const songTitle = document.createElement('div');
                songTitle.textContent = '正在播放: 示例音樂';
                songTitle.style.marginBottom = '10px';
                
                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.gap = '10px';
                
                ['上一首', '播放', '下一首'].forEach(ctrl => {
                    const btn = document.createElement('button');
                    btn.textContent = ctrl;
                    btn.style.padding = '5px 10px';
                    controls.appendChild(btn);
                });
                
                player.appendChild(songTitle);
                player.appendChild(controls);
                content.appendChild(player);
                break;
                
            case '計算機':
                const calculator = document.createElement('div');
                calculator.style.width = '100%';
                calculator.style.height = '100%';
                calculator.style.display = 'flex';
                calculator.style.flexDirection = 'column';
                
                const display = document.createElement('div');
                display.style.background = '#f8f9fa';
                display.style.padding = '10px';
                display.style.textAlign = 'right';
                display.style.fontSize = '1.5rem';
                display.textContent = '0';
                
                const buttons = document.createElement('div');
                buttons.style.display = 'grid';
                buttons.style.gridTemplateColumns = 'repeat(4, 1fr)';
                buttons.style.flex = '1';
                
                const buttonLabels = [
                    '7', '8', '9', '/',
                    '4', '5', '6', '*',
                    '1', '2', '3', '-',
                    '0', '.', '=', '+'
                ];
                
                buttonLabels.forEach(label => {
                    const btn = document.createElement('button');
                    btn.textContent = label;
                    btn.style.border = '1px solid #ddd';
                    btn.style.background = label === '=' ? '#3498db' : 'white';
                    btn.style.color = label === '=' ? 'white' : 'black';
                    buttons.appendChild(btn);
                });
                
                calculator.appendChild(display);
                calculator.appendChild(buttons);
                content.appendChild(calculator);
                break;
                
            default:
                content.textContent = `這是${title}視窗的內容。`;
        }
        
        window.appendChild(header);
        window.appendChild(content);
        container.appendChild(window);
        
        // 添加出現動畫
        window.style.transform = 'scale(0.8)';
        window.style.opacity = '0';
        
        setTimeout(() => {
            window.style.transition = 'all 0.3s ease';
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
        }, 10);
    }
    
    // 使用者界面動畫
    createUIAnimation() {
        const container = this.elements.sceneAnimation;
        
        // 創建使用者界面容器
        const uiContainer = document.createElement('div');
        uiContainer.className = 'ui-container';
        
        // 創建GUI側
        const guiSide = document.createElement('div');
        guiSide.className = 'gui-side';
        
        // 創建桌面圖標
        const desktop = document.createElement('div');
        desktop.className = 'gui-desktop';
        
        const icons = [
            { name: '我的電腦', icon: 'fas fa-desktop' },
            { name: '回收桶', icon: 'fas fa-trash' },
            { name: '文件夾', icon: 'fas fa-folder' },
            { name: '瀏覽器', icon: 'fas fa-globe' },
            { name: '設定', icon: 'fas fa-cog' },
            { name: '音樂', icon: 'fas fa-music' }
        ];
        
        icons.forEach(item => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            
            const i = document.createElement('i');
            i.className = item.icon;
            
            const span = document.createElement('span');
            span.textContent = item.name;
            
            icon.appendChild(i);
            icon.appendChild(span);
            desktop.appendChild(icon);
        });
        
        // 創建任務欄
        const taskbar = document.createElement('div');
        taskbar.className = 'gui-taskbar';
        
        guiSide.appendChild(desktop);
        guiSide.appendChild(taskbar);
        
        // 創建CLI側
        const cliSide = document.createElement('div');
        cliSide.className = 'cli-side';
        
        // 添加命令提示符
        for (let i = 0; i < 3; i++) {
            this.addCommandPrompt(cliSide);
        }
        
        // 添加當前命令提示符
        const currentPrompt = document.createElement('div');
        currentPrompt.className = 'cli-prompt';
        
        const promptText = document.createElement('div');
        promptText.className = 'cli-prompt-text';
        promptText.textContent = 'user@os:~$';
        
        const input = document.createElement('input');
        input.className = 'cli-input';
        input.type = 'text';
        input.placeholder = '輸入命令...';
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value;
                input.value = '';
                
                // 創建命令輸出
                const output = document.createElement('div');
                output.className = 'cli-output';
                
                if (command === 'help') {
                    output.textContent = '可用命令:\nls - 列出檔案\ncd - 切換目錄\nmkdir - 創建目錄\nrm - 刪除檔案\nclear - 清除螢幕';
                } else if (command === 'ls') {
                    output.textContent = 'documents  downloads  pictures  music  videos';
                } else if (command.startsWith('cd ')) {
                    output.textContent = `已切換到 ${command.substring(3)} 目錄`;
                } else if (command === 'clear') {
                    // 清除所有輸出
                    const outputs = cliSide.querySelectorAll('.cli-output');
                    outputs.forEach(out => out.remove());
                    return;
                } else if (command) {
                    output.textContent = `命令未找到: ${command}`;
                } else {
                    return;
                }
                
                // 在當前提示符之前插入輸出
                const commandLine = document.createElement('div');
                commandLine.className = 'cli-output';
                commandLine.textContent = `user@os:~$ ${command}`;
                
                cliSide.insertBefore(commandLine, currentPrompt);
                cliSide.insertBefore(output, currentPrompt);
                
                // 滾動到底部
                cliSide.scrollTop = cliSide.scrollHeight;
            }
        });
        
        currentPrompt.appendChild(promptText);
        currentPrompt.appendChild(input);
        cliSide.appendChild(currentPrompt);
        
        uiContainer.appendChild(guiSide);
        uiContainer.appendChild(cliSide);
        container.appendChild(uiContainer);
        
        // 聚焦輸入框
        setTimeout(() => {
            input.focus();
        }, 500);
    }
    
    // 添加命令提示符
    addCommandPrompt(container) {
        const commands = [
            { cmd: 'ls', output: 'documents  downloads  pictures  music  videos' },
            { cmd: 'pwd', output: '/home/user' },
            { cmd: 'date', output: '2025年5月17日 星期六 21:39:45' },
            { cmd: 'whoami', output: 'user' },
            { cmd: 'uname -a', output: 'Linux os-adventure 5.15.0-25-generic #25-Ubuntu SMP Fri May 5 12:00:00 UTC 2025 x86_64 GNU/Linux' }
        ];
        
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        
        const commandLine = document.createElement('div');
        commandLine.className = 'cli-output';
        commandLine.textContent = `user@os:~$ ${randomCommand.cmd}`;
        
        const output = document.createElement('div');
        output.className = 'cli-output';
        output.textContent = randomCommand.output;
        
        container.appendChild(commandLine);
        container.appendChild(output);
    }
    
    // GUI界面動畫
    createGUIAnimation() {
        const container = this.elements.sceneAnimation;
        container.style.background = 'url("windows-bg.jpg") center/cover';
        
        // 創建GUI演示容器
        const guiDemo = document.createElement('div');
        guiDemo.style.position = 'absolute';
        guiDemo.style.left = '50%';
        guiDemo.style.top = '50%';
        guiDemo.style.transform = 'translate(-50%, -50%)';
        guiDemo.style.width = '80%';
        guiDemo.style.height = '80%';
        guiDemo.style.background = 'rgba(255, 255, 255, 0.9)';
        guiDemo.style.borderRadius = '10px';
        guiDemo.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        guiDemo.style.overflow = 'hidden';
        guiDemo.style.display = 'flex';
        guiDemo.style.flexDirection = 'column';
        
        // 創建標題欄
        const titleBar = document.createElement('div');
        titleBar.style.background = '#3498db';
        titleBar.style.color = 'white';
        titleBar.style.padding = '10px';
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        
        const title = document.createElement('div');
        title.textContent = '圖形化使用者界面 (GUI) 演示';
        
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '5px';
        
        ['#e74c3c', '#f39c12', '#2ecc71'].forEach(color => {
            const control = document.createElement('div');
            control.style.width = '12px';
            control.style.height = '12px';
            control.style.borderRadius = '50%';
            control.style.background = color;
            controls.appendChild(control);
        });
        
        titleBar.appendChild(title);
        titleBar.appendChild(controls);
        
        // 創建內容區域
        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.padding = '20px';
        content.style.overflow = 'auto';
        
        // 創建GUI元素展示
        const elements = [
            { name: '視窗 (Window)', desc: '視窗是GUI的基本容器，用於顯示應用程式的內容。' },
            { name: '按鈕 (Button)', desc: '按鈕是用戶可以點擊的控制元素，用於觸發動作。' },
            { name: '選單 (Menu)', desc: '選單提供了一組選項，讓使用者可以選擇執行不同的操作。' },
            { name: '圖示 (Icon)', desc: '圖示是代表檔案、資料夾或應用程式的小圖片。' },
            { name: '對話框 (Dialog)', desc: '對話框是一種特殊的視窗，用於顯示訊息或請求使用者輸入。' },
            { name: '工具列 (Toolbar)', desc: '工具列包含一組按鈕，提供快速存取常用功能。' },
            { name: '滾動條 (Scrollbar)', desc: '滾動條允許使用者在內容超出可視區域時進行捲動。' }
        ];
        
        elements.forEach(element => {
            const item = document.createElement('div');
            item.style.marginBottom = '15px';
            item.style.padding = '10px';
            item.style.background = '#f8f9fa';
            item.style.borderRadius = '5px';
            item.style.border = '1px solid #e9ecef';
            
            const header = document.createElement('div');
            header.style.fontWeight = 'bold';
            header.style.marginBottom = '5px';
            header.textContent = element.name;
            
            const desc = document.createElement('div');
            desc.textContent = element.desc;
            
            item.appendChild(header);
            item.appendChild(desc);
            content.appendChild(item);
        });
        
        // 創建互動演示區域
        const demo = document.createElement('div');
        demo.style.marginTop = '20px';
        demo.style.padding = '15px';
        demo.style.background = '#e9ecef';
        demo.style.borderRadius = '5px';
        
        const demoTitle = document.createElement('div');
        demoTitle.style.fontWeight = 'bold';
        demoTitle.style.marginBottom = '10px';
        demoTitle.textContent = '互動演示';
        
        const demoContent = document.createElement('div');
        demoContent.style.display = 'flex';
        demoContent.style.flexDirection = 'column';
        demoContent.style.gap = '10px';
        
        // 添加按鈕演示
        const buttonDemo = document.createElement('div');
        
        const buttonLabel = document.createElement('div');
		buttonLabel.textContent = '按鈕演示：';
		buttonLabel.style.marginBottom = '5px';
		    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    
    const buttons = [
        { text: '確定', color: '#2ecc71' },
        { text: '取消', color: '#e74c3c' },
        { text: '更多選項', color: '#3498db' }
    ];
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.style.padding = '8px 15px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.background = btn.color;
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '0.8';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.opacity = '1';
        });
        
        button.addEventListener('click', () => {
            alert(`你點擊了「${btn.text}」按鈕`);
        });
        
        buttonContainer.appendChild(button);
    });
    
    buttonDemo.appendChild(buttonLabel);
    buttonDemo.appendChild(buttonContainer);
    
    // 添加選單演示
    const menuDemo = document.createElement('div');
    
    const menuLabel = document.createElement('div');
    menuLabel.textContent = '選單演示：';
    menuLabel.style.marginBottom = '5px';
    
    const menuBar = document.createElement('div');
    menuBar.style.display = 'flex';
    menuBar.style.background = '#f8f9fa';
    menuBar.style.border = '1px solid #ddd';
    
    const menuItems = ['檔案', '編輯', '檢視', '工具', '說明'];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item;
        menuItem.style.padding = '8px 15px';
        menuItem.style.cursor = 'pointer';
        
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = '#e9ecef';
        });
        
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
        });
        
        menuItem.addEventListener('click', () => {
            alert(`你點擊了「${item}」選單`);
        });
        
        menuBar.appendChild(menuItem);
    });
    
    menuDemo.appendChild(menuLabel);
    menuDemo.appendChild(menuBar);
    
    // 添加對話框演示
    const dialogDemo = document.createElement('div');
    
    const dialogLabel = document.createElement('div');
    dialogLabel.textContent = '對話框演示：';
    dialogLabel.style.marginBottom = '5px';
    
    const dialogButton = document.createElement('button');
    dialogButton.textContent = '顯示對話框';
    dialogButton.style.padding = '8px 15px';
    dialogButton.style.border = 'none';
    dialogButton.style.borderRadius = '5px';
    dialogButton.style.background = '#3498db';
    dialogButton.style.color = 'white';
    dialogButton.style.cursor = 'pointer';
    
    dialogButton.addEventListener('click', () => {
        this.showDialog(container);
    });
    
    dialogDemo.appendChild(dialogLabel);
    dialogDemo.appendChild(dialogButton);
    
    demoContent.appendChild(buttonDemo);
    demoContent.appendChild(menuDemo);
    demoContent.appendChild(dialogDemo);
    
    demo.appendChild(demoTitle);
    demo.appendChild(demoContent);
    content.appendChild(demo);
    
    guiDemo.appendChild(titleBar);
    guiDemo.appendChild(content);
    container.appendChild(guiDemo);
}

// 顯示對話框
showDialog(container) {
    // 創建對話框背景
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '100';
    
    // 創建對話框
    const dialog = document.createElement('div');
    dialog.style.width = '300px';
    dialog.style.background = 'white';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    dialog.style.overflow = 'hidden';
    
    // 創建對話框標題
    const header = document.createElement('div');
    header.style.background = '#3498db';
    header.style.color = 'white';
    header.style.padding = '10px';
    header.textContent = '確認操作';
    
    // 創建對話框內容
    const content = document.createElement('div');
    content.style.padding = '20px';
    content.textContent = '你確定要執行此操作嗎？';
    
    // 創建按鈕區域
    const buttons = document.createElement('div');
    buttons.style.padding = '10px';
    buttons.style.display = 'flex';
    buttons.style.justifyContent = 'flex-end';
    buttons.style.gap = '10px';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.padding = '5px 15px';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '3px';
    cancelBtn.style.background = '#e74c3c';
    cancelBtn.style.color = 'white';
    cancelBtn.style.cursor = 'pointer';
    
    cancelBtn.addEventListener('click', () => {
        container.removeChild(overlay);
    });
    
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '確定';
    confirmBtn.style.padding = '5px 15px';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '3px';
    confirmBtn.style.background = '#2ecc71';
    confirmBtn.style.color = 'white';
    confirmBtn.style.cursor = 'pointer';
    
    confirmBtn.addEventListener('click', () => {
        alert('操作已確認！');
        container.removeChild(overlay);
    });
    
    buttons.appendChild(cancelBtn);
    buttons.appendChild(confirmBtn);
    
    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(buttons);
    overlay.appendChild(dialog);
    container.appendChild(overlay);
    
    // 添加出現動畫
    dialog.style.transform = 'scale(0.8)';
    dialog.style.opacity = '0';
    
    setTimeout(() => {
        dialog.style.transition = 'all 0.3s ease';
        dialog.style.transform = 'scale(1)';
        dialog.style.opacity = '1';
    }, 10);
}

// CLI界面動畫
createCLIAnimation() {
    const container = this.elements.sceneAnimation;
    container.style.background = '#000';
    
    // 創建CLI終端機
    const terminal = document.createElement('div');
    terminal.style.position = 'absolute';
    terminal.style.top = '50%';
    terminal.style.left = '50%';
    terminal.style.transform = 'translate(-50%, -50%)';
    terminal.style.width = '80%';
    terminal.style.height = '80%';
    terminal.style.background = '#000';
    terminal.style.border = '1px solid #333';
    terminal.style.borderRadius = '5px';
    terminal.style.padding = '10px';
    terminal.style.fontFamily = 'monospace';
    terminal.style.color = '#0f0';
    terminal.style.overflow = 'auto';
    
    // 添加終端機標題
    const title = document.createElement('div');
    title.textContent = '命令行介面 (CLI) 演示';
    title.style.color = '#fff';
    title.style.marginBottom = '10px';
    title.style.textAlign = 'center';
    terminal.appendChild(title);
    
    // 添加分隔線
    const divider = document.createElement('div');
    divider.style.height = '1px';
    divider.style.background = '#333';
    divider.style.margin = '5px 0 15px';
    terminal.appendChild(divider);
    
    // 添加命令列表
    const commandList = document.createElement('div');
    commandList.textContent = '常用命令：';
    commandList.style.marginBottom = '10px';
    terminal.appendChild(commandList);
    
    const commands = [
        { cmd: 'ls', desc: '列出目錄內容' },
        { cmd: 'cd', desc: '切換目錄' },
        { cmd: 'mkdir', desc: '創建目錄' },
        { cmd: 'rm', desc: '刪除檔案或目錄' },
        { cmd: 'cp', desc: '複製檔案或目錄' },
        { cmd: 'mv', desc: '移動或重命名檔案或目錄' },
        { cmd: 'cat', desc: '顯示檔案內容' },
        { cmd: 'grep', desc: '搜尋文字' },
        { cmd: 'chmod', desc: '修改檔案權限' },
        { cmd: 'man', desc: '顯示命令手冊' }
    ];
    
    commands.forEach(cmd => {
        const cmdItem = document.createElement('div');
        cmdItem.style.marginBottom = '5px';
        cmdItem.innerHTML = `<span style="color: #3498db">${cmd.cmd}</span> - ${cmd.desc}`;
        terminal.appendChild(cmdItem);
    });
    
    // 添加分隔線
    const divider2 = document.createElement('div');
    divider2.style.height = '1px';
    divider2.style.background = '#333';
    divider2.style.margin = '15px 0';
    terminal.appendChild(divider2);
    
    // 添加互動式命令行
    const promptContainer = document.createElement('div');
    promptContainer.style.marginTop = '20px';
    
    const promptLabel = document.createElement('div');
    promptLabel.textContent = '試試看輸入命令：';
    promptLabel.style.marginBottom = '10px';
    promptContainer.appendChild(promptLabel);
    
    // 添加命令提示符
    const prompt = document.createElement('div');
    prompt.style.display = 'flex';
    
    const promptText = document.createElement('span');
    promptText.textContent = 'user@os:~$ ';
    promptText.style.color = '#3498db';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.style.flex = '1';
    input.style.background = 'transparent';
    input.style.border = 'none';
    input.style.color = '#0f0';
    input.style.fontFamily = 'monospace';
    input.style.outline = 'none';
    
    prompt.appendChild(promptText);
    prompt.appendChild(input);
    
    promptContainer.appendChild(prompt);
    
    // 添加輸出區域
    const output = document.createElement('div');
    output.style.marginTop = '10px';
    output.style.whiteSpace = 'pre-wrap';
    promptContainer.appendChild(output);
    
    // 處理命令輸入
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value;
            input.value = '';
            
            // 顯示輸入的命令
            const cmdLine = document.createElement('div');
            cmdLine.innerHTML = `<span style="color: #3498db">user@os:~$</span> ${command}`;
            output.appendChild(cmdLine);
            
            // 處理命令
            let response;
            if (command === 'help' || command === '--help') {
                response = '可用命令：\nls - 列出目錄內容\ncd - 切換目錄\nmkdir - 創建目錄\nrm - 刪除檔案\nclear - 清除螢幕\necho - 顯示文字\ndate - 顯示日期和時間\npwd - 顯示當前目錄\nwhoami - 顯示當前用戶';
            } else if (command === 'ls') {
                response = 'Documents  Downloads  Pictures  Music  Videos  example.txt';
            } else if (command.startsWith('cd ')) {
                const dir = command.substring(3);
                response = `已切換到 ${dir} 目錄`;
                promptText.textContent = `user@os:~/${dir}$ `;
            } else if (command.startsWith('mkdir ')) {
                const dir = command.substring(6);
                response = `已創建目錄 ${dir}`;
            } else if (command.startsWith('rm ')) {
                const file = command.substring(3);
                response = `已刪除 ${file}`;
            } else if (command === 'clear') {
                output.innerHTML = '';
                return;
            } else if (command.startsWith('echo ')) {
                response = command.substring(5);
            } else if (command === 'date') {
                response = new Date().toString();
            } else if (command === 'pwd') {
                response = '/home/user';
            } else if (command === 'whoami') {
                response = 'user';
            } else if (command) {
                response = `命令未找到: ${command}`;
            } else {
                return;
            }
            
            // 顯示命令輸出
            if (response) {
                const respLine = document.createElement('div');
                respLine.textContent = response;
                output.appendChild(respLine);
            }
            
            // 滾動到底部
            output.scrollTop = output.scrollHeight;
        }
    });
    
    terminal.appendChild(promptContainer);
    container.appendChild(terminal);
    
    // 聚焦輸入框
    setTimeout(() => {
        input.focus();
    }, 500);
}

// 預設動畫
createDefaultAnimation() {
    const container = this.elements.sceneAnimation;
    container.style.background = 'linear-gradient(135deg, #3498db, #8e44ad)';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-laptop-code';
    icon.style.position = 'absolute';
    icon.style.top = '50%';
    icon.style.left = '50%';
    icon.style.transform = 'translate(-50%, -50%)';
    icon.style.fontSize = '5rem';
    icon.style.color = 'white';
    
    container.appendChild(icon);
    
    // 添加脈動動畫
    icon.style.animation = 'pulse 2s infinite';
}

// 播放音效
playSound(type) {
    // 實際項目中可以加入音效
    console.log(`播放音效: ${type}`);
}

// 增加分數
addScore(points) {
    this.state.score += points;
    this.elements.score.textContent = this.state.score;
    
    // 顯示得分動畫
    const scoreAnimation = document.createElement('div');
    scoreAnimation.textContent = `+${points}`;
    scoreAnimation.style.position = 'absolute';
    scoreAnimation.style.top = '20px';
    scoreAnimation.style.right = '20px';
    scoreAnimation.style.color = '#2ecc71';
    scoreAnimation.style.fontSize = '1.5rem';
    scoreAnimation.style.fontWeight = 'bold';
    scoreAnimation.style.opacity = '0';
    scoreAnimation.style.transform = 'translateY(0)';
    scoreAnimation.style.transition = 'all 1s ease';
    
    document.body.appendChild(scoreAnimation);
    
    setTimeout(() => {
        scoreAnimation.style.opacity = '1';
        scoreAnimation.style.transform = 'translateY(-20px)';
    }, 10);
    
    setTimeout(() => {
        scoreAnimation.style.opacity = '0';
    }, 800);
    
    setTimeout(() => {
        document.body.removeChild(scoreAnimation);
    }, 1000);
}

// 更新統計數據
updateStats() {
    this.elements.score.textContent = this.state.score;
    this.elements.lives.textContent = this.state.lives;
    this.elements.characterLevel.textContent = this.state.character.level;
    this.elements.characterExp.textContent = `${this.state.character.exp}/100`;
}

// 處理鍵盤事件
handleKeyPress(e) {
    // 可以添加鍵盤快捷鍵
    console.log(`按下按鍵: ${e.key}`);
}

// 保存進度
saveProgress() {
    localStorage.setItem('osAdventureProgress', JSON.stringify({
        currentChapter: this.state.currentChapter,
        currentScene: this.state.currentScene,
        score: this.state.score,
        character: this.state.character,
        flags: this.state.flags,
        timestamp: Date.now()
    }));
}

// 載入進度
loadProgress() {
    const saved = localStorage.getItem('osAdventureProgress');
    if (saved) {
        const data = JSON.parse(saved);
        this.state.currentChapter = data.currentChapter;
        this.state.currentScene = data.currentScene;
        this.state.score = data.score || 0;
        this.state.character = data.character || this.state.character;
        this.state.flags = data.flags || this.state.flags;
    }
}

// 初始化遊戲內容
initializeGameContent() {
    return [
        // 第0章：介紹
        {
            title: "作業系統基礎",
            scenes: [
                {
                    text: "歡迎來到OS冒險者的世界！在這裡，你將學習作業系統的基本概念與運作原理。作業系統是管理電腦硬體與軟體資源的基礎軟體，為使用者和應用程式提供了操作界面。常見的作業系統包括Microsoft Windows、macOS、Linux等。",
                    animation: "intro",
                    choices: [
                        {
                            text: "開始探索作業系統的世界",
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "作為一名系統管理員，你將探索四個主要領域：資源管理、檔案系統、多工處理和使用者界面。選擇你想先探索的領域吧！",
                    animation: "default",
                    choices: [
                        {
                            text: "資源管理 - 了解CPU、記憶體等硬體資源的分配與管理",
                            nextChapter: 1,
                            nextScene: 0
                        },
                        {
                            text: "檔案系統 - 探索檔案的儲存、組織與管理方式",
                            nextChapter: 2,
                            nextScene: 0
                        },
                        {
                            text: "多工處理 - 學習作業系統如何同時執行多個程式",
                            nextChapter: 3,
                            nextScene: 0
                        },
                        {
                            text: "使用者界面 - 體驗不同類型的操作界面",
                            nextChapter: 4,
                            nextScene: 0
                        }
                    ]
                }
            ]
        },
        
        // 第1章：資源管理
        {
            title: "資源管理",
            scenes: [
                {
                    text: "歡迎來到資源管理領域！作業系統負責管理電腦的硬體資源，包括CPU、記憶體、儲存裝置和輸入輸出裝置，確保各個應用程式能夠有效地使用這些資源。",
                    animation: "resource_intro",
                    choices: [
                        {
                            text: "了解CPU管理",
                            nextScene: 1
                        },
                        {
                            text: "了解記憶體管理",
                            nextScene: 2
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "CPU是電腦的大腦，負責執行指令和處理資料。作業系統使用排程演算法來決定哪個程式可以使用CPU，以及使用多長時間。常見的排程演算法包括先到先服務(FCFS)、最短工作優先(SJF)和輪流調度(Round Robin)等。",
                    animation: "cpu_management",
                    choices: [
                        {
                            text: "嘗試CPU排程模擬",
                            action: "createCPUAnimation",
                            nextScene: 3
                        },
                        {
                            text: "返回資源管理選單",
                            nextScene: 0
                        }
                    ]
                },
                {
                    text: "記憶體是暫時儲存資料和程式的地方。作業系統負責分配記憶體給不同的程式，並確保程式之間不會互相干擾。當實體記憶體不足時，作業系統會使用虛擬記憶體技術，將部分資料暫時存放在硬碟上。",
                    animation: "memory_management",
                    choices: [
                        {
                            text: "嘗試記憶體管理模擬",
                            action: "createMemoryAnimation",
                            nextScene: 4
                        },
                        {
                            text: "返回資源管理選單",
                            nextScene: 0
                        }
                    ]
                },
                {
                    text: "恭喜你完成了CPU排程模擬！你已經了解了不同排程演算法的運作方式，以及它們如何影響系統效能。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回資源管理選單",
                            nextScene: 0
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "恭喜你完成了記憶體管理模擬！你已經了解了記憶體分配與釋放的過程，以及虛擬記憶體的概念。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回資源管理選單",
                            nextScene: 0
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                }
            ]
        },
        
        // 第2章：檔案系統
        {
            title: "檔案系統",
            scenes: [
                {
                    text: "歡迎來到檔案系統領域！檔案系統負責管理電腦上的檔案，包括檔案的建立、儲存、修改和刪除。不同的作業系統可能使用不同的檔案系統格式。",
                    animation: "filesystem_intro",
                    choices: [
                        {
                            text: "了解檔案與目錄結構",
                            nextScene: 1
                        },
                        {
                            text: "了解檔案類型",
                            nextScene: 2
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "檔案系統使用階層式的目錄結構來組織檔案，就像一棵倒置的樹。在這個結構中，最頂層是根目錄(root directory)，下面可以有多個子目錄和檔案。每個檔案和目錄都有一個唯一的路徑，用來標識它在檔案系統中的位置。",
                    animation: "directory_structure",
                    choices: [
                        {
                            text: "嘗試目錄導航模擬",
                            action: "createDirectoryAnimation",
                            nextScene: 3
                        },
                        {
                            text: "返回檔案系統選單",
                            nextScene: 0
                        }
                    ]
                },
                {
                    text: "檔案類型是由檔案的副檔名來標識的，例如.txt、.gif、.doc、.tab等。不同類型的檔案有不同的格式和用途。作業系統會根據檔案類型來決定使用哪個應用程式來開啟檔案。",
                    animation: "file_types",
                    choices: [
                        {
                            text: "嘗試檔案類型模擬",
                            action: "createFileSystemAnimation",
                            nextScene: 4
                        },
                        {
                            text: "返回檔案系統選單",
                            nextScene: 0
                        }
                    ]
                },
                {
                    text: "恭喜你完成了目錄導航模擬！你已經了解了階層式目錄結構的概念，以及如何在檔案系統中導航。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回檔案系統選單",
                            nextScene: 0
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "恭喜你完成了檔案類型模擬！你已經了解了不同類型的檔案及其用途，以及如何管理檔案。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回檔案系統選單",
                            nextScene: 0
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                }
            ]
        },
        
        // 第3章：多工處理
        {
            title: "多工處理",
            scenes: [
                {
                    text: "歡迎來到多工處理領域！多工處理是作業系統能夠同時執行多個程式的能力。這使得使用者可以同時執行多個應用程式，提高電腦的使用效率。",
                    animation: "multitasking_intro",
                    choices: [
                        {
                            text: "了解程序與執行緒",
                            nextScene: 1
                        },
                        {
                            text: "體驗多工處理模擬",
                            nextScene: 2
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "程序(Process)是一個正在執行的程式，它包含程式碼、資料和執行狀態。執行緒(Thread)是程序內的執行單位，一個程序可以有多個執行緒。多執行緒可以提高程式的效率，因為它們可以共享程序的資源。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回多工處理選單",
                            nextScene: 0
                        },
                        {
                            text: "體驗多工處理模擬",
                            nextScene: 2
                        }
                    ]
                },
                {
                    text: "在多工處理環境中，作業系統能夠讓多個程式看似同時執行。這是通過快速切換程式的執行來實現的。現在，你可以體驗多工處理的模擬。",
                    animation: "default",
                    choices: [
                        {
                            text: "開始多工處理模擬",
                            action: "createMultitaskingAnimation",
                            nextScene: 3
                        },
                        {
                            text: "返回多工處理選單",
                            nextScene: 0
                        }
                    ]
                },
                {
                    text: "恭喜你完成了多工處理模擬！你已經了解了作業系統如何同時管理多個程式，以及程式之間如何切換。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回多工處理選單",
                            nextScene: 0
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                }
            ]
        },
        
        // 第4章：使用者界面
        {
            title: "使用者界面",
            scenes: [
                {
                    text: "歡迎來到使用者界面領域！使用者界面是使用者與作業系統互動的方式。常見的使用者界面包括圖形化使用者界面(GUI)和命令行介面(CLI)。",
                    animation: "ui_intro",
                    choices: [
                        {
                            text: "了解圖形化使用者界面(GUI)",
                            nextScene: 1
                        },
                        {
                            text: "了解命令行介面(CLI)",
                            nextScene: 2
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "圖形化使用者界面(GUI)使用視覺元素如視窗、圖示、選單和按鈕，讓使用者能夠直觀地操作電腦。GUI使得電腦更容易使用，特別是對於初學者。Windows、macOS和大多數Linux發行版都提供了GUI。",
                    animation: "gui_interface",
                    choices: [
                        {
                            text: "體驗GUI模擬",
                            action: "createGUIAnimation",
                            nextScene: 3
                        },
                        {
                            text: "返回使用者界面選單",
                            nextScene: 0
                        }
                    ]
                },
                {
                    text: "命令行介面(CLI)使用文字命令來控制電腦。使用者輸入命令，電腦執行並顯示結果。CLI雖然學習曲線較陡，但對於某些任務來說更高效，特別是對於系統管理員和開發人員。Linux和macOS的Terminal，以及Windows的PowerShell和Command Prompt都是CLI的例子。",
                    animation: "cli_interface",
                    choices: [
                        {
                            text: "體驗CLI模擬",
                            action: "createCLIAnimation",
                            nextScene: 4
                        },
                        {
                            text: "返回使用者界面選單",
                            nextScene: 0
                        }
                    ]
                },
                {
                    text: "恭喜你完成了GUI模擬！你已經了解了圖形化使用者界面的基本元素和操作方式。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回使用者界面選單",
                            nextScene: 0
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: "恭喜你完成了CLI模擬！你已經了解了命令行介面的基本操作和常用命令。",
                    animation: "default",
                    choices: [
                        {
                            text: "返回使用者界面選單",
                            nextScene: 0
                        },
                        {
                            text: "返回主選單",
                            nextChapter: 0,
                            nextScene: 1
                        }
                    ]
                }
            ]
        }
    ];
}
}

// 初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
const game = new OSAdventureGame();
});