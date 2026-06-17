import { Group, Text } from 'leafer-unified';
export class LegacyCompressText extends Group<import('leafer-unified').IGroupInputData> {
    /**
     * 创建压缩文本渲染实例，并初始化默认配置、内部缓存和浏览器字体加载后的重排逻辑。
     *
     * @param {object} [data={}] 初始化配置，会与默认配置合并后写入实例。
     */
    constructor(data?: object);
    parseList: any[];
    flatItemList: any[];
    newlineList: any[];
    rubyList: any[];
    rubyLineMap: Map<any, any>;
    currentX: number;
    currentY: number;
    currentLine: number;
    textScale: number;
    firstLineTextScale: number;
    isSmallSize: boolean;
    group: Group<import('leafer-unified').IGroupInputData> | null;
    needCompressTwice: boolean;
    bounds: {};
    defaultData: {
        text: string;
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
        wordSpacing: number;
        firstLineCompress: boolean;
        textAlign: string;
        textJustifyLast: boolean;
        color: string;
        strokeWidth: number;
        gradient: boolean;
        gradientColor1: string;
        gradientColor2: string;
        rtFontFamily: string;
        rtFontSize: number;
        rtFontWeight: string;
        rtLineHeight: number;
        rtLetterSpacing: number;
        rtTop: number;
        rtColor: string;
        rtStrokeWidth: number;
        rtFontScaleX: number;
        fontScale: number;
        autoSmallSize: boolean;
        smallFontSize: number;
        width: number;
        height: number;
        x: number;
        y: number;
        zIndex: number;
    };
    /**
     * 批量更新实例配置。
     *
     * 仅当传入值与当前实例值不同的时候才会触发重新排版，避免无意义的重复计算。
     * 未提供的字段会回退到默认值语义，与现有 set 行为保持一致。
     *
     * @param {object} [data={}] 需要更新的配置项。
     */
    set(data?: object): void;
    /**
     * 使用默认配置初始化实例数据。
     *
     * 该方法会将默认配置与传入配置合并后交给 set，确保初始化和后续更新走同一条赋值逻辑。
     *
     * @param {object} [data={}] 初始化配置。
     */
    initData(data?: object): void;
    /**
     * 解析原始文本，生成内部使用的 itemList 列表。
     *
     * 该过程会处理：
     * 1. bold 标签切换。
     * 2. 显式换行符。
     * 3. noCompressText 中的特殊字符。
     * 4. ruby 标记与 rt 文本拆分。
     *
     * 返回结果中的每一项都是一个 itemList，itemList 由 ruby/rt 成对结构组成，
     * 后续布局、压缩和注音定位都基于这份解析结果展开。
     *
     * @returns {Array<Array<{ruby: object, rt: object}>>} 解析后的文本项列表。
     */
    getParseList(): Array<Array<{
        ruby: object;
        rt: object;
    }>>;
    /**
     * 基于解析结果按显式换行符分组，生成内部的换行段列表。
     *
     * 这里的分组只处理用户输入中的 \n，不负责基于宽度的自动换行。
     * 宽度驱动的换行会在布局阶段由 updateTextScale 处理。
     *
     * @returns {Array<Array<Array<{ruby: object, rt: object}>>>} 按显式换行分组后的列表。
     */
    getNewlineList(): Array<Array<Array<{
        ruby: object;
        rt: object;
    }>>>;
    /**
     * 获取当前参与布局的字号。
     *
     * 当 autoSmallSize 触发并进入小字模式时返回 smallFontSize，否则返回正常字号。
     *
     * @returns {number} 当前布局字号。
     */
    getCurrentFontSize(): number;
    /**
     * 获取某个 ruby 项两侧额外补白的总宽度。
     *
     * 主要用于 rt 过宽时通过 paddingLeft/paddingRight 扩展 ruby 占位宽度的场景。
     *
     * @param {object} ruby ruby 布局对象。
     * @returns {number} 左右补白总和。
     */
    getPaddingWidth(ruby: object): number;
    /**
     * 判断一个 item 是否允许进入超宽回退切段逻辑。
     *
     * 当前仅允许“没有 rt 的纯文本片段”参与切段，避免拆散带注音的原子结构。
     * 同时过滤换行符和长度为 1 的片段，减少无意义处理。
     *
     * @param {{ruby: object, rt: object}} item 文本项。
     * @returns {boolean} 是否允许按宽度切段。
     */
    isSplittablePlainTextItem(item: {
        ruby: object;
        rt: object;
    }): boolean;
    /**
     * 重置压缩阶段的临时状态。
     *
     * 每次完整重排前都会调用，确保 textScale、首行压缩比例、小字状态以及二次压缩标记
     * 从干净状态开始重新计算。
     */
    resetCompressionState(): void;
    /**
     * 重建解析缓存。
     *
     * 该方法会依次刷新 parseList、newlineList 和依赖它们的平铺缓存，
     * 是每次重新排版前的数据准备入口。
     */
    rebuildParseCache(): void;
    /**
     * 重建承载文字叶子的 Leafer Group。
     *
     * 如果旧 group 已存在，则会先销毁旧实例，避免旧叶子残留在场景树中。
     */
    resetGroup(): void;
    /**
     * 创建一个通用文本 item。
     *
     * 该结构同时支持正文与注音文本，供解析阶段和纯文本切段逻辑复用。
     *
     * @param {string} rubyText 正文文本。
     * @param {string} [rtText=''] 注音文本。
     * @param {boolean} [bold=false] 是否按粗体处理。
     * @returns {{ruby: {text: string, bold: boolean}, rt: {text: string}}} 通用文本 item。
     */
    createTextItem(rubyText: string, rtText?: string, bold?: boolean): {
        ruby: {
            text: string;
            bold: boolean;
        };
        rt: {
            text: string;
        };
    };
    /**
     * 创建一个不带注音的纯文本 item。
     *
     * 该方法是 createTextItem 的纯文本特化版本，主要供超宽回退切段时复用。
     *
     * @param {string} text 纯文本内容。
     * @param {boolean} [bold=false] 是否按粗体处理。
     * @returns {{ruby: {text: string, bold: boolean}, rt: {text: string}}} 纯文本 item。
     */
    createPlainTextItem(text: string, bold?: boolean): {
        ruby: {
            text: string;
            bold: boolean;
        };
        rt: {
            text: string;
        };
    };
    /**
     * 将字符串按 Unicode 字符边界拆成字符数组。
     *
     * 使用 Array.from 可以避免 surrogate pair 被错误拆分，适合处理中日韩字符和扩展字符。
     *
     * @param {string} text 原始文本。
     * @returns {string[]} 字符数组。
     */
    getTextCharList(text: string): string[];
    /**
     * 获取字符串按 Unicode 字符边界计算后的长度。
     *
     * @param {string} text 原始文本。
     * @returns {number} 字符数量。
     */
    getTextCharLength(text: string): number;
    /**
     * 创建并立即测量一个纯文本 item。
     *
     * 主要供超宽回退逻辑使用，生成 item 后立即附带 rubyLeaf、宽高等测量信息。
     *
     * @param {string} text 文本内容。
     * @param {boolean} [bold=false] 是否粗体。
     * @returns {{ruby: object, rt: {text: string}}} 已测量的纯文本 item。
     */
    createMeasuredPlainTextItem(text: string, bold?: boolean): {
        ruby: object;
        rt: {
            text: string;
        };
    };
    /**
     * 销毁 ruby 对应的文本叶子。
     *
     * 用于超宽回退切段时清理临时测量叶子，避免多余节点残留。
     *
     * @param {object} ruby ruby 布局对象。
     */
    destroyRubyLeaf(ruby: object): void;
    /**
     * 生成 ruby 正文 Text 叶子所需的样式配置。
     *
     * @param {object} ruby ruby 布局对象。
     * @returns {object} Leafer Text 配置。
     */
    getRubyTextStyle(ruby: object): object;
    /**
     * 生成注音 rt Text 叶子所需的样式配置。
     *
     * @param {object} rt rt 布局对象。
     * @returns {object} Leafer Text 配置。
     */
    getRtTextStyle(rt: object): object;
    /**
     * 创建 ruby 正文叶子并把测量结果回写到 ruby 对象。
     *
     * 测量结果会作为后续换行、压缩、对齐和边界计算的基础数据。
     * 对于空格字符，会额外叠加 wordSpacing。
     *
     * @param {object} ruby ruby 布局对象。
     * @returns {Text} 创建出的 Leafer Text 实例。
     */
    createRubyLeaf(ruby: object): Text;
    /**
     * 创建 rt 注音叶子并把测量结果回写到 rt 对象。
     *
     * @param {object} rt rt 布局对象。
     * @returns {Text} 创建出的 Leafer Text 实例。
     */
    createRtLeaf(rt: object): Text;
    /**
     * 在 rt 触发宽度压缩扩展后重新执行一次正文布局。
     *
     * 当 rt 太宽导致 ruby 被加宽时，需要重新计算正文换行、压缩和对齐，
     * 否则正文与注音的相对位置会失真。
     */
    relayoutAfterRtCompression(): void;
    /**
     * 根据当前 parseList 重建平铺缓存。
     *
     * flatItemList 供统一遍历 item 使用，rubyList 则供正文定位、对齐与边界计算使用。
     */
    updateLayoutCache(): void;
    /**
     * 按当前 ruby.line 信息重建按行分组的映射。
     *
     * 该映射主要用于对齐和边界统计，line 小于 0 的项会被视为无效项并跳过。
     */
    updateRubyLineMap(): void;
    /**
     * 执行完整的文本压缩与渲染流程。
     *
     * 顺序包括：
     * 1. 重置压缩状态。
     * 2. 重建解析缓存。
     * 3. 重建承载 group。
     * 4. 创建正文叶子并处理超宽回退。
     * 5. 计算压缩、对齐、注音、渐变与边界。
     * 6. 将结果挂入当前 Group。
     */
    compressText(): void;
    /**
     * 创建正文 ruby 叶子并执行基于宽度的初步布局准备。
     *
     * 该阶段会先为解析结果中的 ruby 创建叶子，随后应用超宽回退切段，
     * 再将最终保留的 rubyLeaf 加入 group，并执行一次基础布局。
     */
    createRuby(): void;
    /**
     * 在给定起点上，通过二分查找找到当前容器宽度下可容纳的最大文本片段。
     *
     * 该方法会不断创建临时测量 item，保留最后一个能放下的候选项，
     * 是超长连续文本切段的核心测量逻辑。
     *
     * @param {string[]} textList 字符数组。
     * @param {number} start 当前片段起始索引。
     * @param {boolean} bold 是否粗体。
     * @returns {{ruby: object, rt: {text: string}}} 当前起点下最大可容纳的文本片段。
     */
    findLargestFittingTextSegment(textList: string[], start: number, bold: boolean): {
        ruby: object;
        rt: {
            text: string;
        };
    };
    /**
     * 将单个纯文本 item 按宽度切分成多个可容纳片段。
     *
      * 该方法仅在单个纯文本片段自身超宽时作为回退路径触发。
      *
     * 切分结果仍然保持 itemList 结构，便于直接复用现有布局流程。
     *
     * @param {{ruby: object, rt: object}} item 需要切分的纯文本项。
     * @returns {Array<Array<{ruby: object, rt: object}>>} 切分后的片段列表。
     */
    splitPlainTextItemIntoFittingSegments(item: {
        ruby: object;
        rt: object;
    }): Array<Array<{
        ruby: object;
        rt: object;
    }>>;
    /**
     * 对单个 item 应用超宽回退扩展。
     *
     * 如果该 item 可拆分，则会先清理原有测量叶子，再按宽度切成多个片段；
     * 否则保持原样返回。
     *
     * @param {{ruby: object, rt: object}} item 文本项。
     * @returns {Array<Array<{ruby: object, rt: object}>>} 展开后的片段列表。
     */
    expandItemForOverflowFallback(item: {
        ruby: object;
        rt: object;
    }): Array<Array<{
        ruby: object;
        rt: object;
    }>>;
    /**
     * 将一个超宽 itemList 按规则展开成多个可布局片段。
     *
     * @param {Array<{ruby: object, rt: object}>} itemList 原始 itemList。
     * @returns {Array<Array<{ruby: object, rt: object}>>} 展开后的 itemList 列表。
     */
    splitOversizedItemList(itemList: Array<{
        ruby: object;
        rt: object;
    }>): Array<Array<{
        ruby: object;
        rt: object;
    }>>;
    /**
     * 对单个 itemList 应用超宽回退逻辑。
     *
     * 只有当 itemList 总宽度超过容器宽度，且其中存在允许切段的纯文本项时，
     * 才会触发回退切分；否则保持原始结构。
     *
     * @param {Array<{ruby: object, rt: object}>} itemList 原始 itemList。
     * @returns {Array<Array<{ruby: object, rt: object}>>} 处理后的 itemList 列表。
     */
    applyOverflowFallbackToItemList(itemList: Array<{
        ruby: object;
        rt: object;
    }>): Array<Array<{
        ruby: object;
        rt: object;
    }>>;
    /**
     * 对整份换行段列表应用超宽回退逻辑。
     *
     * 该方法会重建 newlineList、parseList 以及依赖它们的平铺缓存，
     * 确保后续布局直接基于已经切段后的结构运行。
     */
    applyOverflowFallback(): void;
    /**
     * 计算首行压缩时的最大可用缩放比例。
     *
     * 该方法只考虑显式换行分组中的第一段，返回值会截断到三位小数并且不超过 1。
     *
     * @returns {number} 首行可用的压缩比例。
     */
    getFirstLineScale(): number;
    /**
     * 判断当前布局状态下末尾 ruby 是否已经超出高度限制。
     *
     * @param {object} lastRuby 当前最后一个 ruby 项。
     * @returns {boolean} 是否超出高度限制。
     */
    doesOverflowHeight(lastRuby: object): boolean;
    /**
     * 判断当前高度压缩是否已经达到单行收敛边界。
     *
     * 当文本已经被压缩到一行，但单行本身的高度仍然超过容器高度时，
     * 继续做横向压缩也无法进一步降低高度，应直接停止压缩。
     *
     * @param {object} lastRuby 当前最后一个 ruby 项。
     * @returns {boolean} 是否已经达到单行高度边界。
     */
    reachedSingleLineHeightLimit(lastRuby: object): boolean;
    /**
     * 根据当前宽高限制计算正文压缩比例。
     *
     * 包含两类压缩：
     * 1. 首行压缩到一行。
     * 2. 在高度不足时对最后一行执行二分缩放。
     *
     * 当开启 autoSmallSize 且缩放过小时，会切换到 smallFontSize 再重新计算。
     */
    compressRuby(): void;
    /**
     * 获取当前需要参与对齐处理的行数。
     *
     * 当存在压缩、居中、右对齐或最后一行也需要 justify 时，需要把最后一行也纳入对齐。
     *
     * @returns {number} 需要对齐的行数。
     */
    getAlignLineCount(): number;
    /**
     * 获取某一行在当前布局后的剩余可用宽度。
     *
     * @param {object[]} lineList 当前行的 ruby 列表。
     * @returns {number} 当前行剩余宽度。
     */
    getLineRemainWidth(lineList: object[]): number;
    /**
     * 按给定偏移规则整体移动一行 ruby 的 x 坐标。
     *
     * @param {object[]} lineList 当前行的 ruby 列表。
     * @param {(index: number) => number} offsetStep 根据索引返回偏移量的函数。
     */
    offsetRubyLine(lineList: object[], offsetStep: (index: number) => number): void;
    /**
     * 对单行 ruby 执行居中对齐。
     *
     * @param {object[]} lineList 当前行的 ruby 列表。
     * @param {number} remainWidth 当前行剩余宽度。
     */
    alignCenterLine(lineList: object[], remainWidth: number): void;
    /**
     * 对单行 ruby 执行右对齐。
     *
     * @param {object[]} lineList 当前行的 ruby 列表。
     * @param {number} remainWidth 当前行剩余宽度。
     */
    alignRightLine(lineList: object[], remainWidth: number): void;
    /**
     * 对单行 ruby 执行两端对齐。
     *
     * 仅当当前行存在至少两个可参与分配的项且末尾不是显式换行符时才会生效。
     *
     * @param {object[]} lineList 当前行的 ruby 列表。
     * @param {number} remainWidth 当前行剩余宽度。
     */
    alignJustifyLine(lineList: object[], remainWidth: number): void;
    /**
     * 根据当前 textAlign 对单行 ruby 应用对应的对齐逻辑。
     *
     * @param {object[]} lineList 当前行的 ruby 列表。
     * @param {number} remainWidth 当前行剩余宽度。
     */
    alignRubyLine(lineList: object[], remainWidth: number): void;
    /**
     * 对所有需要处理的行执行正文对齐。
      *
      * 该方法会根据当前对齐模式遍历每一行，并在存在剩余宽度时应用对应的对齐策略。
     */
    alignRuby(): void;
    /**
     * 创建所有注音 rt 叶子并完成初始定位。
     *
     * 如果在 rt 压缩过程中触发了正文扩宽，会再执行一次正文重排以保持对齐正确。
     */
    createRt(): void;
    /**
     * 更新单个 ruby 的横向缩放比例和当前宽度。
     *
     * @param {object} ruby ruby 布局对象。
     * @param {number} scale 横向缩放比例。
     */
    updateRubyScale(ruby: object, scale: number): void;
    /**
     * 计算一个 itemList 在当前状态下的总宽度。
     *
     * 宽度包含每个 ruby 自身宽度以及左右补白。
     *
     * @param {Array<{ruby: object, rt: object}>} itemList 文本项列表。
     * @returns {number} 总宽度。
     */
    getItemWidth(itemList: Array<{
        ruby: object;
        rt: object;
    }>): number;
    /**
     * 更新一个 itemList 中所有 ruby 的缩放状态。
     *
     * 该方法会根据是否首行压缩、是否最后一段以及 noCompressText 规则决定使用哪种缩放比例。
     *
     * @param {Array<{ruby: object, rt: object}>} itemList 文本项列表。
     * @param {number} newlineIndex 当前显式换行分组索引。
     * @param {boolean} lastNewline 当前是否最后一个显式换行分组。
     */
    updateItemRubyScale(itemList: Array<{
        ruby: object;
        rt: object;
    }>, newlineIndex: number, lastNewline: boolean): void;
    /**
     * 重置布局过程中的游标状态。
     */
    resetLayoutPosition(): void;
    /**
     * 判断当前 itemList 在当前位置是否需要换到下一行。
     *
     * @param {Array<{ruby: object, rt: object}>} itemList 当前文本项列表。
     * @param {number} itemWidth 当前文本项总宽度。
     * @returns {boolean} 是否需要换行。
     */
    shouldWrapItemList(itemList: Array<{
        ruby: object;
        rt: object;
    }>, itemWidth: number): boolean;
    /**
     * 顺序定位一个 itemList 中所有 ruby 的坐标。
     *
     * @param {Array<{ruby: object, rt: object}>} itemList 当前文本项列表。
     */
    positionItemListRuby(itemList: Array<{
        ruby: object;
        rt: object;
    }>): void;
    /**
     * 布局一个 itemList。
     *
     * 包括缩放、换行判断以及最终定位。
     *
     * @param {Array<{ruby: object, rt: object}>} itemList 当前文本项列表。
     * @param {number} newlineIndex 当前显式换行分组索引。
     * @param {boolean} lastNewline 当前是否最后一个显式换行分组。
     */
    layoutItemList(itemList: Array<{
        ruby: object;
        rt: object;
    }>, newlineIndex: number, lastNewline: boolean): void;
    /**
     * 布局一个显式换行分组中的所有 itemList。
     *
     * @param {Array<Array<{ruby: object, rt: object}>>} newline 当前分组。
     * @param {number} newlineIndex 当前分组索引。
     */
    layoutNewlineItems(newline: Array<Array<{
        ruby: object;
        rt: object;
    }>>, newlineIndex: number): void;
    /**
     * 根据当前缩放状态重新执行一次正文布局。
     *
     * 该方法会重置游标，然后按显式换行分组顺序重新排版，最后刷新 rubyLineMap。
     */
    updateTextScale(): void;
    /**
     * 在切换到小字模式后更新所有 ruby 的尺寸信息。
     *
      * 更新后会立即重新布局，以确保新的字号、宽度和高度信息全部生效。
     */
    updateFontSize(): void;
    /**
     * 定位单个 ruby 的坐标并更新当前行游标。
     *
     * @param {object} ruby ruby 布局对象。
     */
    positionRuby(ruby: object): void;
    /**
     * 切换到下一行并更新行游标。
     *
     * 切行前会先清理上一行末尾多余空格。
     */
    addLine(): void;
    /**
     * 删除指定行尾部连续的空格项。
     *
     * 这些空格在排版结束后不应继续占据宽度，因此会同步回退 currentX。
     *
     * @param {number} line 目标行号。
     */
    removeLineLastSpace(line: number): void;
    /**
     * 获取注音布局所需的上下文信息。
     *
     * @param {{ruby: object, rt: object}} item 包含 ruby 与 rt 的文本项。
     * @returns {{ruby: object, rt: object, rubyLeaf: Text, rtLeaf: Text, paddingLeft: number, paddingRight: number, rubyWidth: number}} 注音布局上下文。
     */
    getRtLayoutContext(item: {
        ruby: object;
        rt: object;
    }): {
        ruby: object;
        rt: object;
        rubyLeaf: Text;
        rtLeaf: Text;
        paddingLeft: number;
        paddingRight: number;
        rubyWidth: number;
    };
    /**
     * 执行注音的基础定位。
     *
     * @param {{rubyLeaf: Text, rtLeaf: Text, paddingLeft: number, rubyWidth: number}} context 注音布局上下文。
     */
    positionRtBase(context: {
        rubyLeaf: Text;
        rtLeaf: Text;
        paddingLeft: number;
        rubyWidth: number;
    }): void;
    /**
     * 应用直接指定的注音横向缩放。
     *
     * @param {{rtLeaf: Text}} context 注音布局上下文。
     */
    applyRtScaleXOverride(context: {
        rtLeaf: Text;
    }): void;
    /**
     * 通过增加字距对注音执行拉伸。
     *
     * @param {{ruby: object, rt: object, rtLeaf: Text, rubyWidth: number}} context 注音布局上下文。
     */
    stretchRtLetterSpacing(context: {
        ruby: object;
        rt: object;
        rtLeaf: Text;
        rubyWidth: number;
    }): void;
    /**
     * 在注音宽于正文时执行压缩或扩宽正文占位。
     *
     * @param {{ruby: object, rt: object, rtLeaf: Text, rubyWidth: number}} context 注音布局上下文。
     */
    compressRtToRubyWidth(context: {
        ruby: object;
        rt: object;
        rtLeaf: Text;
        rubyWidth: number;
    }): void;
    /**
     * 根据注音与正文宽度关系选择对应的宽度适配策略。
     *
     * @param {{ruby: object, rt: object, rtLeaf: Text, rubyWidth: number}} context 注音布局上下文。
     */
    applyRtWidthStrategy(context: {
        ruby: object;
        rt: object;
        rtLeaf: Text;
        rubyWidth: number;
    }): void;
    /**
     * 定位并调整单个注音 rt。
     *
     * 该方法会根据 ruby 和 rt 的宽度关系选择：
     * 1. 直接使用指定 scaleX。
     * 2. 增加 letterSpacing 进行拉伸。
     * 3. 压缩 rt。
     * 4. 在必要时通过增加 ruby padding 触发二次正文重排。
     *
     * @param {{ruby: object, rt: object}} item 包含 ruby 与 rt 的文本项。
     */
    positionRt(item: {
        ruby: object;
        rt: object;
    }): void;
    /**
     * 为正文叶子应用渐变、描边和阴影效果。
     *
     * 仅在 gradient 开启时生效。
     */
    createGradient(): void;
    /**
     * 根据当前行分组结果统计最终渲染边界。
     *
     * 结果会写入 this.bounds，供外部或后续逻辑读取。
     */
    createBounds(): void;
}
