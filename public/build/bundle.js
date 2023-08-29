
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    // Adapted from https://github.com/then/is-promise/blob/master/index.js
    // Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
    function is_promise(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    /**
     * List of attributes that should always be set through the attr method,
     * because updating them through the property setter doesn't work reliably.
     * In the example of `width`/`height`, the problem is that the setter only
     * accepts numeric values, but the attribute can also be set to a string like `50%`.
     * If this list becomes too big, rethink this approach.
     */
    const always_set_through_set_attribute = ['width', 'height'];
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1, Object: Object_1, console: console_1$g } = globals;

    // (251:0) {:else}
    function create_else_block$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$g.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Home.svelte generated by Svelte v3.59.2 */

    const file$y = "src/Home.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (42:12) {#each apis as api}
    function create_each_block_2(ctx) {
    	let li;
    	let a;
    	let t_value = /*api*/ ctx[9].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", /*api*/ ctx[9].link);
    			add_location(a, file$y, 42, 20, 1562);
    			add_location(li, file$y, 42, 16, 1558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(42:12) {#each apis as api}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#each apiEndpoints as endpoint}
    function create_each_block_1$2(ctx) {
    	let li;
    	let a;
    	let t_value = /*endpoint*/ ctx[6].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", /*endpoint*/ ctx[6].link);
    			add_location(a, file$y, 49, 20, 1736);
    			add_location(li, file$y, 49, 16, 1732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(49:12) {#each apiEndpoints as endpoint}",
    		ctx
    	});

    	return block;
    }

    // (56:12) {#each frontEndLinks as link}
    function create_each_block$7(ctx) {
    	let li;
    	let a;
    	let t_value = /*link*/ ctx[3].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", /*link*/ ctx[3].link);
    			add_location(a, file$y, 56, 20, 1931);
    			add_location(li, file$y, 56, 16, 1927);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(56:12) {#each frontEndLinks as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let main;
    	let br0;
    	let t0;
    	let div1;
    	let div0;
    	let h3;
    	let t2;
    	let h40;
    	let t4;
    	let li0;
    	let t6;
    	let li1;
    	let t8;
    	let li2;
    	let t10;
    	let br1;
    	let t11;
    	let h41;
    	let t13;
    	let li3;
    	let a0;
    	let t15;
    	let br2;
    	let t16;
    	let h42;
    	let t18;
    	let li4;
    	let a1;
    	let t20;
    	let hr0;
    	let t21;
    	let h43;
    	let t23;
    	let ul0;
    	let t24;
    	let h44;
    	let t26;
    	let ul1;
    	let t27;
    	let h45;
    	let t29;
    	let ul2;
    	let t30;
    	let hr1;
    	let t31;
    	let h46;
    	let t33;
    	let h50;
    	let t35;
    	let li5;
    	let t36;
    	let a2;
    	let t38;
    	let li6;
    	let a3;
    	let t40;
    	let br3;
    	let t41;
    	let h51;
    	let t43;
    	let li7;
    	let t44;
    	let a4;
    	let t46;
    	let li8;
    	let a5;
    	let t48;
    	let br4;
    	let t49;
    	let h52;
    	let t51;
    	let li9;
    	let t52;
    	let a6;
    	let t54;
    	let li10;
    	let a7;
    	let t56;
    	let br5;
    	let each_value_2 = /*apis*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*apiEndpoints*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*frontEndLinks*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			br0 = element("br");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "TFG-Svelte";
    			t2 = space();
    			h40 = element("h4");
    			h40.textContent = "Descripción:";
    			t4 = space();
    			li0 = element("li");
    			li0.textContent = "Relación de deportes entre fútbol (Premier League), tenis y baloncesto (NBA)";
    			t6 = space();
    			li1 = element("li");
    			li1.textContent = "Visualizaciones de graficas conjuntas a APIs propias editables en las paginas front-ends";
    			t8 = space();
    			li2 = element("li");
    			li2.textContent = "Integraciones de APIs externas junto a sus respectivas visualizaciones";
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			h41 = element("h4");
    			h41.textContent = "Repositorio github:";
    			t13 = space();
    			li3 = element("li");
    			a0 = element("a");
    			a0.textContent = "https://github.com/Antoniiosc7/TFG-Svelte";
    			t15 = space();
    			br2 = element("br");
    			t16 = space();
    			h42 = element("h4");
    			h42.textContent = "Desplegado en:";
    			t18 = space();
    			li4 = element("li");
    			a1 = element("a");
    			a1.textContent = "http://antoniosaborido.es:8081";
    			t20 = space();
    			hr0 = element("hr");
    			t21 = space();
    			h43 = element("h4");
    			h43.textContent = "Documentación APIs propias";
    			t23 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t24 = space();
    			h44 = element("h4");
    			h44.textContent = "APIs";
    			t26 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t27 = space();
    			h45 = element("h4");
    			h45.textContent = "Front-Ends propios";
    			t29 = space();
    			ul2 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t30 = space();
    			hr1 = element("hr");
    			t31 = space();
    			h46 = element("h4");
    			h46.textContent = "APIs externas:";
    			t33 = space();
    			h50 = element("h5");
    			h50.textContent = "API Twitch";
    			t35 = space();
    			li5 = element("li");
    			t36 = text("Documentación: ");
    			a2 = element("a");
    			a2.textContent = "https://dev.twitch.tv/docs/api/";
    			t38 = space();
    			li6 = element("li");
    			a3 = element("a");
    			a3.textContent = "Implementación";
    			t40 = space();
    			br3 = element("br");
    			t41 = space();
    			h51 = element("h5");
    			h51.textContent = "API Clasificacion ATP Actualizada";
    			t43 = space();
    			li7 = element("li");
    			t44 = text("Documentación: ");
    			a4 = element("a");
    			a4.textContent = "https://rapidapi.com/cantagalloedoardo/api/ultimate-tennis1/details";
    			t46 = space();
    			li8 = element("li");
    			a5 = element("a");
    			a5.textContent = "Implementación";
    			t48 = space();
    			br4 = element("br");
    			t49 = space();
    			h52 = element("h5");
    			h52.textContent = "API Top Tennis Femenino";
    			t51 = space();
    			li9 = element("li");
    			t52 = text("Documentación: ");
    			a6 = element("a");
    			a6.textContent = "https://rapidapi.com/tipsters/api/sportscore1";
    			t54 = space();
    			li10 = element("li");
    			a7 = element("a");
    			a7.textContent = "Implementación";
    			t56 = space();
    			br5 = element("br");
    			add_location(br0, file$y, 20, 4, 710);
    			add_location(h3, file$y, 23, 12, 781);
    			attr_dev(div0, "id", "titulo");
    			add_location(div0, file$y, 22, 8, 751);
    			add_location(h40, file$y, 26, 8, 825);
    			add_location(li0, file$y, 27, 8, 855);
    			add_location(li1, file$y, 28, 8, 949);
    			add_location(li2, file$y, 29, 8, 1055);
    			add_location(br1, file$y, 30, 8, 1143);
    			add_location(h41, file$y, 31, 8, 1156);
    			attr_dev(a0, "href", "https://github.com/Antoniiosc7/TFG-Svelte");
    			add_location(a0, file$y, 32, 12, 1197);
    			add_location(li3, file$y, 32, 8, 1193);
    			add_location(br2, file$y, 33, 8, 1308);
    			add_location(h42, file$y, 34, 8, 1321);
    			attr_dev(a1, "href", "http://antoniosaborido.es:8081");
    			add_location(a1, file$y, 35, 12, 1357);
    			add_location(li4, file$y, 35, 8, 1353);
    			add_location(hr0, file$y, 37, 8, 1447);
    			add_location(h43, file$y, 39, 8, 1461);
    			add_location(ul0, file$y, 40, 8, 1505);
    			add_location(h44, file$y, 46, 8, 1644);
    			add_location(ul1, file$y, 47, 8, 1666);
    			add_location(h45, file$y, 53, 8, 1828);
    			add_location(ul2, file$y, 54, 8, 1864);
    			add_location(hr1, file$y, 59, 8, 2014);
    			add_location(h46, file$y, 60, 8, 2027);
    			add_location(h50, file$y, 61, 8, 2060);
    			attr_dev(a2, "href", "https://dev.twitch.tv/docs/api/");
    			add_location(a2, file$y, 62, 27, 2108);
    			add_location(li5, file$y, 62, 8, 2089);
    			attr_dev(a3, "href", "/#/twitchHub");
    			add_location(a3, file$y, 63, 12, 2203);
    			add_location(li6, file$y, 63, 8, 2199);
    			add_location(br3, file$y, 64, 8, 2258);
    			add_location(h51, file$y, 65, 8, 2271);
    			attr_dev(a4, "href", "https://rapidapi.com/cantagalloedoardo/api/ultimate-tennis1/details");
    			add_location(a4, file$y, 66, 27, 2342);
    			add_location(li7, file$y, 66, 8, 2323);
    			attr_dev(a5, "href", "/#/topTennis");
    			add_location(a5, file$y, 67, 12, 2509);
    			add_location(li8, file$y, 67, 8, 2505);
    			add_location(br4, file$y, 68, 8, 2564);
    			add_location(h52, file$y, 69, 8, 2577);
    			attr_dev(a6, "href", "https://rapidapi.com/tipsters/api/sportscore1");
    			add_location(a6, file$y, 70, 27, 2638);
    			add_location(li9, file$y, 70, 8, 2619);
    			attr_dev(a7, "href", "/#/tennisFem");
    			add_location(a7, file$y, 71, 12, 2761);
    			add_location(li10, file$y, 71, 8, 2757);
    			add_location(br5, file$y, 72, 8, 2816);
    			attr_dev(div1, "class", "container svelte-4bh629");
    			add_location(div1, file$y, 21, 4, 719);
    			add_location(main, file$y, 19, 0, 699);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, br0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(div1, t2);
    			append_dev(div1, h40);
    			append_dev(div1, t4);
    			append_dev(div1, li0);
    			append_dev(div1, t6);
    			append_dev(div1, li1);
    			append_dev(div1, t8);
    			append_dev(div1, li2);
    			append_dev(div1, t10);
    			append_dev(div1, br1);
    			append_dev(div1, t11);
    			append_dev(div1, h41);
    			append_dev(div1, t13);
    			append_dev(div1, li3);
    			append_dev(li3, a0);
    			append_dev(div1, t15);
    			append_dev(div1, br2);
    			append_dev(div1, t16);
    			append_dev(div1, h42);
    			append_dev(div1, t18);
    			append_dev(div1, li4);
    			append_dev(li4, a1);
    			append_dev(div1, t20);
    			append_dev(div1, hr0);
    			append_dev(div1, t21);
    			append_dev(div1, h43);
    			append_dev(div1, t23);
    			append_dev(div1, ul0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(ul0, null);
    				}
    			}

    			append_dev(div1, t24);
    			append_dev(div1, h44);
    			append_dev(div1, t26);
    			append_dev(div1, ul1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(ul1, null);
    				}
    			}

    			append_dev(div1, t27);
    			append_dev(div1, h45);
    			append_dev(div1, t29);
    			append_dev(div1, ul2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul2, null);
    				}
    			}

    			append_dev(div1, t30);
    			append_dev(div1, hr1);
    			append_dev(div1, t31);
    			append_dev(div1, h46);
    			append_dev(div1, t33);
    			append_dev(div1, h50);
    			append_dev(div1, t35);
    			append_dev(div1, li5);
    			append_dev(li5, t36);
    			append_dev(li5, a2);
    			append_dev(div1, t38);
    			append_dev(div1, li6);
    			append_dev(li6, a3);
    			append_dev(div1, t40);
    			append_dev(div1, br3);
    			append_dev(div1, t41);
    			append_dev(div1, h51);
    			append_dev(div1, t43);
    			append_dev(div1, li7);
    			append_dev(li7, t44);
    			append_dev(li7, a4);
    			append_dev(div1, t46);
    			append_dev(div1, li8);
    			append_dev(li8, a5);
    			append_dev(div1, t48);
    			append_dev(div1, br4);
    			append_dev(div1, t49);
    			append_dev(div1, h52);
    			append_dev(div1, t51);
    			append_dev(div1, li9);
    			append_dev(li9, t52);
    			append_dev(li9, a6);
    			append_dev(div1, t54);
    			append_dev(div1, li10);
    			append_dev(li10, a7);
    			append_dev(div1, t56);
    			append_dev(div1, br5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*apis*/ 1) {
    				each_value_2 = /*apis*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*apiEndpoints*/ 2) {
    				each_value_1 = /*apiEndpoints*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*frontEndLinks*/ 4) {
    				each_value = /*frontEndLinks*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);

    	let apis = [
    		{
    			name: "API Tennis Documentaciñón",
    			link: "https://sos2122-23.herokuapp.com/api/v1/tennis/docs"
    		},
    		{
    			name: "API Premier-League Documentación",
    			link: "https://sos2122-23.herokuapp.com/api/v2/tennis/docs"
    		}
    	];

    	let apiEndpoints = [
    		{
    			name: "API Premier League",
    			link: "http://antoniosaborido.es/api/v2/premier-league"
    		},
    		{
    			name: "API Tennis",
    			link: "http://antoniosaborido.es/api/v2/tennis"
    		}
    	];

    	let frontEndLinks = [
    		{
    			name: "Tennis Frontend",
    			link: "http://antoniosaborido.es:8081/#/Tennis"
    		},
    		{
    			name: "Premier-League Frontend",
    			link: "http://antoniosaborido.es:8081/#/Premier-League"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ apis, apiEndpoints, frontEndLinks });

    	$$self.$inject_state = $$props => {
    		if ('apis' in $$props) $$invalidate(0, apis = $$props.apis);
    		if ('apiEndpoints' in $$props) $$invalidate(1, apiEndpoints = $$props.apiEndpoints);
    		if ('frontEndLinks' in $$props) $$invalidate(2, frontEndLinks = $$props.frontEndLinks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [apis, apiEndpoints, frontEndLinks];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    function getTransitionDuration(element) {
      if (!element) return 0;

      // Get transition-duration of the element
      let { transitionDuration, transitionDelay } =
        window.getComputedStyle(element);

      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (
        (Number.parseFloat(transitionDuration) +
          Number.parseFloat(transitionDelay)) *
        1000
      );
    }

    /* node_modules/sveltestrap/src/Colgroup.svelte generated by Svelte v3.59.2 */
    const file$x = "node_modules/sveltestrap/src/Colgroup.svelte";

    function create_fragment$x(ctx) {
    	let colgroup;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			colgroup = element("colgroup");
    			if (default_slot) default_slot.c();
    			add_location(colgroup, file$x, 6, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, colgroup, anchor);

    			if (default_slot) {
    				default_slot.m(colgroup, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(colgroup);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Colgroup', slots, ['default']);
    	setContext('colgroup', true);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Colgroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$scope, slots];
    }

    class Colgroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Colgroup",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* node_modules/sveltestrap/src/ResponsiveContainer.svelte generated by Svelte v3.59.2 */
    const file$w = "node_modules/sveltestrap/src/ResponsiveContainer.svelte";

    // (15:0) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:0) {#if responsive}
    function create_if_block$8(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			add_location(div, file$w, 13, 2, 305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*responsiveClassName*/ 2) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(13:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let responsiveClassName;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ResponsiveContainer', slots, ['default']);
    	let className = '';
    	let { responsive = false } = $$props;
    	const writable_props = ['responsive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ResponsiveContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		responsive,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(4, className = $$props.className);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('responsiveClassName' in $$props) $$invalidate(1, responsiveClassName = $$props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(1, responsiveClassName = classnames(className, {
    				'table-responsive': responsive === true,
    				[`table-responsive-${responsive}`]: typeof responsive === 'string'
    			}));
    		}
    	};

    	return [responsive, responsiveClassName, $$scope, slots];
    }

    class ResponsiveContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { responsive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResponsiveContainer",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get responsive() {
    		throw new Error("<ResponsiveContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<ResponsiveContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/TableFooter.svelte generated by Svelte v3.59.2 */
    const file$v = "node_modules/sveltestrap/src/TableFooter.svelte";

    function create_fragment$v(ctx) {
    	let tfoot;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tfoot_levels = [/*$$restProps*/ ctx[0]];
    	let tfoot_data = {};

    	for (let i = 0; i < tfoot_levels.length; i += 1) {
    		tfoot_data = assign(tfoot_data, tfoot_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tfoot = element("tfoot");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$v, 7, 2, 117);
    			set_attributes(tfoot, tfoot_data);
    			add_location(tfoot, file$v, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tfoot, anchor);
    			append_dev(tfoot, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tfoot, tfoot_data = get_spread_update(tfoot_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tfoot);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableFooter', slots, ['default']);
    	setContext('footer', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableFooter",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* node_modules/sveltestrap/src/TableHeader.svelte generated by Svelte v3.59.2 */
    const file$u = "node_modules/sveltestrap/src/TableHeader.svelte";

    function create_fragment$u(ctx) {
    	let thead;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let thead_levels = [/*$$restProps*/ ctx[0]];
    	let thead_data = {};

    	for (let i = 0; i < thead_levels.length; i += 1) {
    		thead_data = assign(thead_data, thead_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$u, 7, 2, 117);
    			set_attributes(thead, thead_data);
    			add_location(thead, file$u, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(thead, thead_data = get_spread_update(thead_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHeader', slots, ['default']);
    	setContext('header', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHeader",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* node_modules/sveltestrap/src/Table.svelte generated by Svelte v3.59.2 */
    const file$t = "node_modules/sveltestrap/src/Table.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes_1 = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context_1 = ctx => ({ row: /*row*/ ctx[13] });
    const get_default_slot_changes = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context = ctx => ({ row: /*row*/ ctx[13] });

    // (50:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if rows}
    function create_if_block$7(ctx) {
    	let colgroup;
    	let t0;
    	let tableheader;
    	let t1;
    	let tbody;
    	let t2;
    	let tablefooter;
    	let current;

    	colgroup = new Colgroup({
    			props: {
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tableheader = new TableHeader({
    			props: {
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*rows*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	tablefooter = new TableFooter({
    			props: {
    				$$slots: { default: [create_default_slot_1$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(colgroup.$$.fragment);
    			t0 = space();
    			create_component(tableheader.$$.fragment);
    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(tablefooter.$$.fragment);
    			add_location(tbody, file$t, 39, 6, 1057);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colgroup, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tableheader, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			insert_dev(target, t2, anchor);
    			mount_component(tablefooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colgroup_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				colgroup_changes.$$scope = { dirty, ctx };
    			}

    			colgroup.$set(colgroup_changes);
    			const tableheader_changes = {};

    			if (dirty & /*$$scope, rows*/ 4098) {
    				tableheader_changes.$$scope = { dirty, ctx };
    			}

    			tableheader.$set(tableheader_changes);

    			if (dirty & /*$$scope, rows*/ 4098) {
    				each_value = /*rows*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const tablefooter_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				tablefooter_changes.$$scope = { dirty, ctx };
    			}

    			tablefooter.$set(tablefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colgroup.$$.fragment, local);
    			transition_in(tableheader.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(tablefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colgroup.$$.fragment, local);
    			transition_out(tableheader.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(tablefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colgroup, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tableheader, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tablefooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(33:4) {#if rows}",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Colgroup>
    function create_default_slot_3$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(34:6) <Colgroup>",
    		ctx
    	});

    	return block;
    }

    // (37:6) <TableHeader>
    function create_default_slot_2$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(37:6) <TableHeader>",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each rows as row}
    function create_each_block$6(ctx) {
    	let tr;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			t = space();
    			add_location(tr, file$t, 41, 10, 1103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(41:8) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (47:6) <TableFooter>
    function create_default_slot_1$d(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$d.name,
    		type: "slot",
    		source: "(47:6) <TableFooter>",
    		ctx
    	});

    	return block;
    }

    // (31:0) <ResponsiveContainer {responsive}>
    function create_default_slot$g(ctx) {
    	let table;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*rows*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if_block.c();
    			set_attributes(table, table_data);
    			add_location(table, file$t, 31, 2, 885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			if_blocks[current_block_type_index].m(table, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(table, null);
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(31:0) <ResponsiveContainer {responsive}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let responsivecontainer;
    	let current;

    	responsivecontainer = new ResponsiveContainer({
    			props: {
    				responsive: /*responsive*/ ctx[0],
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivecontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const responsivecontainer_changes = {};
    			if (dirty & /*responsive*/ 1) responsivecontainer_changes.responsive = /*responsive*/ ctx[0];

    			if (dirty & /*$$scope, $$restProps, classes, rows*/ 4110) {
    				responsivecontainer_changes.$$scope = { dirty, ctx };
    			}

    			responsivecontainer.$set(responsivecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","size","bordered","borderless","striped","dark","hover","responsive","rows"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { size = '' } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;
    	let { rows = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$new_props) $$invalidate(1, rows = $$new_props.rows);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		Colgroup,
    		ResponsiveContainer,
    		TableFooter,
    		TableHeader,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		rows,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$props) $$invalidate(1, rows = $$new_props.rows);
    		if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(2, classes = classnames(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, borderless ? 'table-borderless' : false, striped ? 'table-striped' : false, dark ? 'table-dark' : false, hover ? 'table-hover' : false));
    		}
    	};

    	return [
    		responsive,
    		rows,
    		classes,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		slots,
    		$$scope
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0,
    			rows: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Button.svelte generated by Svelte v3.59.2 */
    const file$s = "node_modules/sveltestrap/src/Button.svelte";

    // (54:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$s, 54, 2, 1124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[23](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 262146)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$6(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$s, 37, 2, 866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			/*a_binding*/ ctx[22](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			/*a_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:6) {#if children}
    function create_if_block_2$1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(66:6) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    // (65:10)        
    function fallback_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(65:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (50:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if children}
    function create_if_block_1$1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(48:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value","white"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { inner = undefined } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { white = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$new_props) $$invalidate(17, white = $$new_props.white);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		inner,
    		outline,
    		size,
    		style,
    		value,
    		white,
    		defaultAriaLabel,
    		classes,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$props) $$invalidate(17, white = $$new_props.white);
    		if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active, white*/ 261120) {
    			$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    				active,
    				'btn-close-white': close && white
    			}));
    		}

    		if ($$self.$$.dirty & /*close*/ 8192) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		inner,
    		children,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		close,
    		color,
    		outline,
    		size,
    		white,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 1,
    			close: 13,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			inner: 0,
    			outline: 15,
    			size: 16,
    			style: 4,
    			value: 5,
    			white: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get white() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set white(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules/sveltestrap/src/Alert.svelte generated by Svelte v3.59.2 */
    const file$r = "node_modules/sveltestrap/src/Alert.svelte";
    const get_heading_slot_changes = dirty => ({});
    const get_heading_slot_context = ctx => ({});

    // (26:0) {#if isOpen}
    function create_if_block$5(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block2;
    	let div_transition;
    	let current;
    	let if_block0 = (/*heading*/ ctx[3] || /*$$slots*/ ctx[10].heading) && create_if_block_3(ctx);
    	let if_block1 = /*showClose*/ ctx[5] && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*$$restProps*/ ctx[9], { class: /*classes*/ ctx[7] }, { role: "alert" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if_block2.c();
    			set_attributes(div, div_data);
    			add_location(div, file$r, 26, 2, 808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*heading*/ ctx[3] || /*$$slots*/ ctx[10].heading) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*heading, $$slots*/ 1032) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*showClose*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				{ role: "alert" }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(26:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if heading || $$slots.heading}
    function create_if_block_3(ctx) {
    	let h4;
    	let t;
    	let current;
    	const heading_slot_template = /*#slots*/ ctx[18].heading;
    	const heading_slot = create_slot(heading_slot_template, ctx, /*$$scope*/ ctx[17], get_heading_slot_context);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(/*heading*/ ctx[3]);
    			if (heading_slot) heading_slot.c();
    			attr_dev(h4, "class", "alert-heading");
    			add_location(h4, file$r, 33, 6, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);

    			if (heading_slot) {
    				heading_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*heading*/ 8) set_data_dev(t, /*heading*/ ctx[3]);

    			if (heading_slot) {
    				if (heading_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						heading_slot,
    						heading_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(heading_slot_template, /*$$scope*/ ctx[17], dirty, get_heading_slot_changes),
    						get_heading_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (heading_slot) heading_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(33:4) {#if heading || $$slots.heading}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if showClose}
    function create_if_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[2]);
    			add_location(button, file$r, 38, 6, 1077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleToggle*/ ctx[8])) /*handleToggle*/ ctx[8].apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*closeClassNames*/ 64) {
    				attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			}

    			if (dirty & /*closeAriaLabel*/ 4) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(38:4) {#if showClose}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(48:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(46:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let showClose;
    	let handleToggle;
    	let classes;
    	let closeClassNames;

    	const omit_props_names = [
    		"class","children","color","closeClassName","closeAriaLabel","dismissible","heading","isOpen","toggle","fade","transition"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alert', slots, ['heading','default']);
    	const $$slots = compute_slots(slots);
    	let { class: className = '' } = $$props;
    	let { children = undefined } = $$props;
    	let { color = 'success' } = $$props;
    	let { closeClassName = '' } = $$props;
    	let { closeAriaLabel = 'Close' } = $$props;
    	let { dismissible = false } = $$props;
    	let { heading = undefined } = $$props;
    	let { isOpen = true } = $$props;
    	let { toggle = undefined } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { transition = { duration: fade$1 ? 400 : 0 } } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('color' in $$new_props) $$invalidate(12, color = $$new_props.color);
    		if ('closeClassName' in $$new_props) $$invalidate(13, closeClassName = $$new_props.closeClassName);
    		if ('closeAriaLabel' in $$new_props) $$invalidate(2, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('dismissible' in $$new_props) $$invalidate(14, dismissible = $$new_props.dismissible);
    		if ('heading' in $$new_props) $$invalidate(3, heading = $$new_props.heading);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('toggle' in $$new_props) $$invalidate(15, toggle = $$new_props.toggle);
    		if ('fade' in $$new_props) $$invalidate(16, fade$1 = $$new_props.fade);
    		if ('transition' in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fadeTransition: fade,
    		classnames,
    		className,
    		children,
    		color,
    		closeClassName,
    		closeAriaLabel,
    		dismissible,
    		heading,
    		isOpen,
    		toggle,
    		fade: fade$1,
    		transition,
    		closeClassNames,
    		showClose,
    		classes,
    		handleToggle
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(11, className = $$new_props.className);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('color' in $$props) $$invalidate(12, color = $$new_props.color);
    		if ('closeClassName' in $$props) $$invalidate(13, closeClassName = $$new_props.closeClassName);
    		if ('closeAriaLabel' in $$props) $$invalidate(2, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('dismissible' in $$props) $$invalidate(14, dismissible = $$new_props.dismissible);
    		if ('heading' in $$props) $$invalidate(3, heading = $$new_props.heading);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('toggle' in $$props) $$invalidate(15, toggle = $$new_props.toggle);
    		if ('fade' in $$props) $$invalidate(16, fade$1 = $$new_props.fade);
    		if ('transition' in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ('closeClassNames' in $$props) $$invalidate(6, closeClassNames = $$new_props.closeClassNames);
    		if ('showClose' in $$props) $$invalidate(5, showClose = $$new_props.showClose);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('handleToggle' in $$props) $$invalidate(8, handleToggle = $$new_props.handleToggle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dismissible, toggle*/ 49152) {
    			$$invalidate(5, showClose = dismissible || toggle);
    		}

    		if ($$self.$$.dirty & /*toggle*/ 32768) {
    			$$invalidate(8, handleToggle = toggle || (() => $$invalidate(0, isOpen = false)));
    		}

    		if ($$self.$$.dirty & /*className, color, showClose*/ 6176) {
    			$$invalidate(7, classes = classnames(className, 'alert', `alert-${color}`, { 'alert-dismissible': showClose }));
    		}

    		if ($$self.$$.dirty & /*closeClassName*/ 8192) {
    			$$invalidate(6, closeClassNames = classnames('btn-close', closeClassName));
    		}
    	};

    	return [
    		isOpen,
    		children,
    		closeAriaLabel,
    		heading,
    		transition,
    		showClose,
    		closeClassNames,
    		classes,
    		handleToggle,
    		$$restProps,
    		$$slots,
    		className,
    		color,
    		closeClassName,
    		dismissible,
    		toggle,
    		fade$1,
    		$$scope,
    		slots
    	];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			class: 11,
    			children: 1,
    			color: 12,
    			closeClassName: 13,
    			closeAriaLabel: 2,
    			dismissible: 14,
    			heading: 3,
    			isOpen: 0,
    			toggle: 15,
    			fade: 16,
    			transition: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get class() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeClassName() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeClassName(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dismissible() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismissible(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // config.js
    const getBASEUrl = () => "http://80.31.134.12:80";

    /* src/tennis/list.svelte generated by Svelte v3.59.2 */

    const { console: console_1$f } = globals;
    const file$q = "src/tennis/list.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>     import { onMount }
    function create_catch_block$6(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$6.name,
    		type: "catch",
    		source: "(1:0) <script>     import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (204:1) {:then entries}
    function create_then_block$6(ctx) {
    	let alert_1;
    	let t0;
    	let table0;
    	let t1;
    	let table1;
    	let t2;
    	let button0;
    	let t3;
    	let button1;
    	let t4;
    	let button2;
    	let t5;
    	let button3;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[2],
    				toggle: /*func*/ ctx[15],
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*LoadEntries*/ ctx[10]);

    	button1 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*BorrarEntries*/ ctx[13]);

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*click_handler_2*/ ctx[25]);

    	button3 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*click_handler_3*/ ctx[26]);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			create_component(table1.$$.fragment);
    			t2 = space();
    			create_component(button0.$$.fragment);
    			t3 = space();
    			create_component(button1.$$.fragment);
    			t4 = space();
    			create_component(button2.$$.fragment);
    			t5 = space();
    			create_component(button3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(button3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty[0] & /*color*/ 8) alert_1_changes.color = /*color*/ ctx[3];
    			if (dirty[0] & /*visible*/ 4) alert_1_changes.isOpen = /*visible*/ ctx[2];
    			if (dirty[0] & /*visible*/ 4) alert_1_changes.toggle = /*func*/ ctx[15];

    			if (dirty[0] & /*checkMSG*/ 2 | dirty[1] & /*$$scope*/ 512) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, checkMSG*/ 50 | dirty[1] & /*$$scope*/ 512) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*entries, newEntry*/ 257 | dirty[1] & /*$$scope*/ 512) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(button3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$6.name,
    		type: "then",
    		source: "(204:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (207:2) {#if checkMSG}
    function create_if_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 2) set_data_dev(t, /*checkMSG*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(207:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (206:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_14(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(206:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (224:23) <Button outline color="dark" on:click="{()=>{      if (from == null || to == null) {       window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')      }else{                         checkMSG = "Datos cargados correctamente en ese periodo";       getEntries();      }     }}">
    function create_default_slot_13$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(224:23) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{      if (from == null || to == null) {       window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')      }else{                         checkMSG = \\\"Datos cargados correctamente en ese periodo\\\";       getEntries();      }     }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (235:23) <Button outline color="info" on:click="{()=>{      from = null;      to = null;      getEntries();                     checkMSG = "Busqueda limpiada";           }}">
    function create_default_slot_12$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(235:23) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{      from = null;      to = null;      getEntries();                     checkMSG = \\\"Busqueda limpiada\\\";           }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (211:4) <Table bordered>
    function create_default_slot_11$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t4;
    	let th3;
    	let t5;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t6;
    	let td1;
    	let input1;
    	let t7;
    	let td2;
    	let button0;
    	let t8;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[18]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[19]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			th2 = element("th");
    			t4 = space();
    			th3 = element("th");
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t6 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t7 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t8 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$q, 213, 4, 6871);
    			add_location(th1, file$q, 214, 4, 6897);
    			add_location(th2, file$q, 215, 4, 6920);
    			add_location(th3, file$q, 216, 16, 6946);
    			add_location(tr0, file$q, 212, 3, 6862);
    			add_location(thead, file$q, 211, 2, 6851);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "2000");
    			add_location(input0, file$q, 221, 8, 7002);
    			add_location(td0, file$q, 221, 4, 6998);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "2000");
    			add_location(input1, file$q, 222, 8, 7068);
    			add_location(td1, file$q, 222, 4, 7064);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$q, 223, 4, 7128);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$q, 234, 4, 7484);
    			add_location(tr1, file$q, 220, 3, 6989);
    			add_location(tbody, file$q, 219, 2, 6978);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t4);
    			append_dev(tr0, th3);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[4]);
    			append_dev(tr1, t6);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[5]);
    			append_dev(tr1, t7);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t8);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 16 && to_number(input0.value) !== /*from*/ ctx[4]) {
    				set_input_value(input0, /*from*/ ctx[4]);
    			}

    			if (dirty[0] & /*to*/ 32 && to_number(input1.value) !== /*to*/ ctx[5]) {
    				set_input_value(input1, /*to*/ ctx[5]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(211:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (273:8) <Button outline color="primary" on:click="{insertEntry}">
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(273:8) <Button outline color=\\\"primary\\\" on:click=\\\"{insertEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (285:9) <Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(285:9) <Button outline color=\\\"danger\\\" on:click={BorrarEntry(entry.country,entry.year)}>",
    		ctx
    	});

    	return block;
    }

    // (278:3) {#each entries as entry}
    function create_each_block_1$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[37].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[37].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[37].most_grand_slam + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[37].masters_finals + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[37].olympic_gold_medals + "";
    	let t8;
    	let t9;
    	let td5;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*BorrarEntry*/ ctx[12](/*entry*/ ctx[37].country, /*entry*/ ctx[37].year))) /*BorrarEntry*/ ctx[12](/*entry*/ ctx[37].country, /*entry*/ ctx[37].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(td0, file$q, 279, 5, 8521);
    			add_location(td1, file$q, 280, 5, 8551);
    			add_location(td2, file$q, 281, 5, 8578);
    			add_location(td3, file$q, 282, 20, 8631);
    			add_location(td4, file$q, 283, 20, 8683);
    			add_location(td5, file$q, 284, 5, 8725);
    			add_location(tr, file$q, 278, 4, 8511);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*entries*/ 256) && t0_value !== (t0_value = /*entry*/ ctx[37].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t2_value !== (t2_value = /*entry*/ ctx[37].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t4_value !== (t4_value = /*entry*/ ctx[37].most_grand_slam + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t6_value !== (t6_value = /*entry*/ ctx[37].masters_finals + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t8_value !== (t8_value = /*entry*/ ctx[37].olympic_gold_medals + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(278:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (292:8) <Button outline color="success" on:click={LoadEntries}>
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(292:8) <Button outline color=\\\"success\\\" on:click={LoadEntries}>",
    		ctx
    	});

    	return block;
    }

    // (295:8) <Button outline color="danger" on:click={BorrarEntries}>
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(295:8) <Button outline color=\\\"danger\\\" on:click={BorrarEntries}>",
    		ctx
    	});

    	return block;
    }

    // (251:1) <Table bordered>
    function create_default_slot_6$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t10;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t11;
    	let td1;
    	let input1;
    	let t12;
    	let td2;
    	let input2;
    	let t13;
    	let td3;
    	let input3;
    	let t14;
    	let td4;
    	let input4;
    	let t15;
    	let td5;
    	let button0;
    	let t16;
    	let t17;
    	let tr2;
    	let td6;
    	let button1;
    	let t18;
    	let td7;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertEntry*/ ctx[11]);
    	let each_value_1 = /*entries*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*LoadEntries*/ ctx[10]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*BorrarEntries*/ ctx[13]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Grand Slams Ganados";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Masters 1000 Ganados";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Medallas Olimpicas";
    			t9 = space();
    			th5 = element("th");
    			t10 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t11 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t12 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t13 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t14 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t15 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t17 = space();
    			tr2 = element("tr");
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t18 = space();
    			td7 = element("td");
    			create_component(button2.$$.fragment);
    			add_location(th0, file$q, 256, 4, 7858);
    			add_location(th1, file$q, 257, 4, 7876);
    			add_location(th2, file$q, 258, 4, 7893);
    			add_location(th3, file$q, 259, 4, 7926);
    			add_location(th4, file$q, 260, 16, 7972);
    			add_location(th5, file$q, 262, 4, 8005);
    			add_location(tr0, file$q, 254, 3, 7844);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$q, 253, 2, 7818);
    			add_location(input0, file$q, 267, 8, 8062);
    			add_location(td0, file$q, 267, 4, 8058);
    			add_location(input1, file$q, 268, 8, 8115);
    			add_location(td1, file$q, 268, 4, 8111);
    			add_location(input2, file$q, 269, 8, 8165);
    			add_location(td2, file$q, 269, 4, 8161);
    			add_location(input3, file$q, 270, 20, 8238);
    			add_location(td3, file$q, 270, 16, 8234);
    			add_location(input4, file$q, 271, 20, 8310);
    			add_location(td4, file$q, 271, 16, 8306);
    			add_location(td5, file$q, 272, 4, 8371);
    			add_location(tr1, file$q, 266, 3, 8049);
    			add_location(td6, file$q, 291, 4, 8882);
    			add_location(td7, file$q, 294, 4, 8983);
    			add_location(tr2, file$q, 290, 3, 8873);
    			add_location(tbody, file$q, 265, 2, 8038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newEntry*/ ctx[0].country);
    			append_dev(tr1, t11);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newEntry*/ ctx[0].year);
    			append_dev(tr1, t12);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newEntry*/ ctx[0].most_grand_slam);
    			append_dev(tr1, t13);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newEntry*/ ctx[0].masters_finals);
    			append_dev(tr1, t14);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newEntry*/ ctx[0].olympic_gold_medals);
    			append_dev(tr1, t15);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tbody, t16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			append_dev(tbody, t17);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr2, t18);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[20]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[21]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[22]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[23]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[24])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newEntry*/ 1 && input0.value !== /*newEntry*/ ctx[0].country) {
    				set_input_value(input0, /*newEntry*/ ctx[0].country);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input1.value !== /*newEntry*/ ctx[0].year) {
    				set_input_value(input1, /*newEntry*/ ctx[0].year);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input2.value !== /*newEntry*/ ctx[0].most_grand_slam) {
    				set_input_value(input2, /*newEntry*/ ctx[0].most_grand_slam);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input3.value !== /*newEntry*/ ctx[0].masters_finals) {
    				set_input_value(input3, /*newEntry*/ ctx[0].masters_finals);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input4.value !== /*newEntry*/ ctx[0].olympic_gold_medals) {
    				set_input_value(input4, /*newEntry*/ ctx[0].olympic_gold_medals);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (dirty[0] & /*BorrarEntry, entries*/ 4352) {
    				each_value_1 = /*entries*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t17);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button1);
    			destroy_component(button2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(251:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (301:1) <Button color="success" on:click="{LoadEntries}">
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(301:1) <Button color=\\\"success\\\" on:click=\\\"{LoadEntries}\\\">",
    		ctx
    	});

    	return block;
    }

    // (304:1) <Button color="danger" on:click="{BorrarEntries}">
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(304:1) <Button color=\\\"danger\\\" on:click=\\\"{BorrarEntries}\\\">",
    		ctx
    	});

    	return block;
    }

    // (307:1) <Button color="info" on:click={function (){   window.location.href = `/#/tennis/chart`  }}>
    function create_default_slot_3$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(307:1) <Button color=\\\"info\\\" on:click={function (){   window.location.href = `/#/tennis/chart`  }}>",
    		ctx
    	});

    	return block;
    }

    // (312:1) <Button color="info" on:click={function (){   window.location.href = `/#/tennis/chart2`  }}>
    function create_default_slot_2$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(312:1) <Button color=\\\"info\\\" on:click={function (){   window.location.href = `/#/tennis/chart2`  }}>",
    		ctx
    	});

    	return block;
    }

    // (202:17)    loading  {:then entries}
    function create_pending_block$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$6.name,
    		type: "pending",
    		source: "(202:17)    loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (321:8) <Button outline color="secondary" on:click={()=>{             offset = page;             getEntries();         }}>
    function create_default_slot_1$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*page*/ ctx[14]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$c.name,
    		type: "slot",
    		source: "(321:8) <Button outline color=\\\"secondary\\\" on:click={()=>{             offset = page;             getEntries();         }}>",
    		ctx
    	});

    	return block;
    }

    // (319:4) {#each Array(maxPages+1) as _,page}
    function create_each_block$5(ctx) {
    	let button;
    	let t;
    	let current;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[27](/*page*/ ctx[14]);
    	}

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_1$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler_4);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    			t = text(" ");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(319:4) {#each Array(maxPages+1) as _,page}",
    		ctx
    	});

    	return block;
    }

    // (327:4) <Button outline color="secondary" on:click={()=>{         getEntries();     }}>
    function create_default_slot$f(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar nº de página");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(327:4) <Button outline color=\\\"secondary\\\" on:click={()=>{         getEntries();     }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let promise;
    	let t4;
    	let div;
    	let t5;
    	let button;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$6,
    		then: create_then_block$6,
    		catch: create_catch_block$6,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[8], info);
    	let each_value = Array(/*maxPages*/ ctx[7] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_5*/ ctx[28]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "TENNIS API";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Los últimos campeones de los grandes torneos del tenis internacional.";
    			t3 = space();
    			info.block.c();
    			t4 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$q, 193, 4, 6452);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$q, 192, 2, 6416);
    			add_location(p, file$q, 195, 2, 6490);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$q, 191, 1, 6385);
    			attr_dev(div, "align", "center");
    			add_location(div, file$q, 317, 0, 9514);
    			add_location(main, file$q, 189, 0, 6375);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t4;
    			append_dev(main, t4);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t5);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*entries*/ 256 && promise !== (promise = /*entries*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			if (dirty[0] & /*offset, getEntries, maxPages*/ 704) {
    				each_value = Array(/*maxPages*/ ctx[7] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t5);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_each(each_blocks, detaching);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	const BASEUrl = getBASEUrl();
    	var BASE_API_PATH = `${BASEUrl}/api/v2/tennis`;

    	//var BASE_API_PATH = "/api/v2/tennis";
    	let entries = [];

    	let newEntry = {
    		country: "",
    		year: "",
    		most_grand_slam: "",
    		masters_finals: "",
    		olympic_gold_medals: ""
    	};

    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let page = 1;
    	let totaldata = 6;
    	let from = null;
    	let to = null;
    	let offset = 0;
    	let limit = 10;
    	let maxPages = 0;
    	let numEntries;
    	onMount(getEntries);

    	//GET
    	async function getEntries() {
    		console.log("Fetching entries....");
    		let cadena = `${BASE_API_PATH}?limit=${limit}&&offset=${offset * 10}&&`;

    		if (from != null) {
    			cadena = cadena + `from=${from}&&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}&&`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset * 10}`);
    			maxPagesFunction(cadenaPag[0] + cadenaPag[1]);
    			const data = await res.json();
    			$$invalidate(8, entries = data);
    			numEntries = entries.length;
    			console.log("Received entries: " + entries.length);
    		} else {
    			Errores(res.status);
    		}
    	}

    	//GET INITIALDATA
    	async function LoadEntries() {
    		console.log("Fetching entry data...");
    		await fetch(BASE_API_PATH + "/loadInitialData");
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(8, entries = json);
    			$$invalidate(2, visible = true);
    			totaldata = 6;
    			console.log("Received " + entries.length + " entry data.");
    			$$invalidate(3, color = "success");
    			$$invalidate(1, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(3, color = "danger");
    			$$invalidate(1, checkMSG = res.status + ": " + "No se pudo cargar los datos");
    			console.log("ERROR! ");
    		}
    	}

    	//INSERT DATA
    	async function insertEntry() {
    		console.log("Inserting resources...");

    		if (newEntry.country == "" || newEntry.year == null || newEntry.most_grand_slam == null || newEntry.masters_finals == null || newEntry.olympic_gold_medals == null) {
    			alert("Los campos no pueden estar vacios");
    		} else {
    			await fetch(BASE_API_PATH, {
    				method: "POST",
    				body: JSON.stringify({
    					country: newEntry.country,
    					year: parseInt(newEntry.year),
    					most_grand_slam: parseFloat(newEntry.most_grand_slam),
    					masters_finals: parseFloat(newEntry.masters_finals),
    					olympic_gold_medals: parseFloat(newEntry.olympic_gold_medals)
    				}),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.status == 201) {
    					getEntries();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Entrada introducida correctamente a la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that country and year in the da tabase");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Ya existe una entrada en la base de datos con el pais y el año introducido");
    				}
    			});
    		}
    	}

    	//DELETE STAT
    	async function BorrarEntry(countryD, yearD) {
    		await fetch(BASE_API_PATH + "/" + countryD + "/" + yearD, { method: "DELETE" }).then(function (res) {
    			$$invalidate(2, visible = true);
    			getEntries();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(3, color = "success");
    				$$invalidate(1, checkMSG = "Recurso " + countryD + " " + yearD + " borrado correctamente");
    				console.log("Deleted " + countryD);
    			} else if (res.status == 404) {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = "No se ha encontrado el objeto " + countryD);
    				console.log("Resource NOT FOUND");
    			} else {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = res.status + ": " + "No se pudo borrar el recurso");
    				console.log("ERROR!");
    			}
    		});
    	}

    	//DELETE ALL STATS
    	async function BorrarEntries() {
    		console.log("Deleting entry data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all entry data...");

    			await fetch(BASE_API_PATH, { method: "DELETE" }).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getEntries();
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//Función auxiliar para obtener el número máximo de páginas que se pueden ver
    	async function maxPagesFunction(cadena) {
    		const res = await fetch(cadena, { method: "GET" });

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(7, maxPages = Math.floor(data.length / 10));

    			if (maxPages === data.length / 10) {
    				$$invalidate(7, maxPages = maxPages - 1);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$f.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(4, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(5, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos');
    		} else {
    			$$invalidate(1, checkMSG = "Datos cargados correctamente en ese periodo");
    			getEntries();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(4, from = null);
    		$$invalidate(5, to = null);
    		getEntries();
    		$$invalidate(1, checkMSG = "Busqueda limpiada");
    	};

    	function input0_input_handler_1() {
    		newEntry.country = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input1_input_handler_1() {
    		newEntry.year = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input2_input_handler() {
    		newEntry.most_grand_slam = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input3_input_handler() {
    		newEntry.masters_finals = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input4_input_handler() {
    		newEntry.olympic_gold_medals = this.value;
    		$$invalidate(0, newEntry);
    	}

    	const click_handler_2 = function () {
    		window.location.href = `/#/tennis/chart`;
    	};

    	const click_handler_3 = function () {
    		window.location.href = `/#/tennis/chart2`;
    	};

    	const click_handler_4 = page => {
    		$$invalidate(6, offset = page);
    		getEntries();
    	};

    	const click_handler_5 = () => {
    		getEntries();
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		getBASEUrl,
    		BASEUrl,
    		BASE_API_PATH,
    		entries,
    		newEntry,
    		checkMSG,
    		visible,
    		color,
    		page,
    		totaldata,
    		from,
    		to,
    		offset,
    		limit,
    		maxPages,
    		numEntries,
    		getEntries,
    		LoadEntries,
    		insertEntry,
    		BorrarEntry,
    		BorrarEntries,
    		maxPagesFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entries' in $$props) $$invalidate(8, entries = $$props.entries);
    		if ('newEntry' in $$props) $$invalidate(0, newEntry = $$props.newEntry);
    		if ('checkMSG' in $$props) $$invalidate(1, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('page' in $$props) $$invalidate(14, page = $$props.page);
    		if ('totaldata' in $$props) totaldata = $$props.totaldata;
    		if ('from' in $$props) $$invalidate(4, from = $$props.from);
    		if ('to' in $$props) $$invalidate(5, to = $$props.to);
    		if ('offset' in $$props) $$invalidate(6, offset = $$props.offset);
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('maxPages' in $$props) $$invalidate(7, maxPages = $$props.maxPages);
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newEntry,
    		checkMSG,
    		visible,
    		color,
    		from,
    		to,
    		offset,
    		maxPages,
    		entries,
    		getEntries,
    		LoadEntries,
    		insertEntry,
    		BorrarEntry,
    		BorrarEntries,
    		page,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src/tennis/edit.svelte generated by Svelte v3.59.2 */

    const { console: console_1$e } = globals;
    const file$p = "src/tennis/edit.svelte";

    // (71:8) {#if errorMsg}
    function create_if_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*errorMsg*/ ctx[8]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 256) set_data_dev(t, /*errorMsg*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(71:8) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (70:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[8] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*errorMsg*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(70:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let params = {}
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>     export let params = {}",
    		ctx
    	});

    	return block;
    }

    // (79:8) {:then entry}
    function create_then_block$5(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedolympic_gold_medals, updatedmasters_finals, updatedmost_grand_slam, updatedYear, updatedCountry*/ 1048824) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(79:8) {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (102:24) <Button outline color="primary" on:click="{EditEntry}">
    function create_default_slot_2$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(102:24) <Button outline color=\\\"primary\\\" on:click=\\\"{EditEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (82:8) <Table bordered>
    function create_default_slot_1$b(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*EditEntry*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Grand Slams Ganados";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Masters 1000 Ganados";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Medallas Olimpicas";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$p, 85, 20, 2917);
    			add_location(th1, file$p, 86, 20, 2951);
    			add_location(th2, file$p, 87, 20, 2984);
    			add_location(th3, file$p, 88, 20, 3033);
    			add_location(th4, file$p, 89, 20, 3083);
    			add_location(th5, file$p, 90, 20, 3131);
    			add_location(tr0, file$p, 83, 16, 2887);
    			add_location(thead, file$p, 82, 12, 2863);
    			add_location(input0, file$p, 96, 24, 3258);
    			add_location(td0, file$p, 96, 20, 3254);
    			add_location(input1, file$p, 97, 24, 3325);
    			add_location(td1, file$p, 97, 20, 3321);
    			add_location(input2, file$p, 98, 24, 3391);
    			add_location(td2, file$p, 98, 20, 3387);
    			add_location(input3, file$p, 99, 24, 3466);
    			add_location(td3, file$p, 99, 20, 3462);
    			add_location(input4, file$p, 100, 24, 3540);
    			add_location(td4, file$p, 100, 20, 3536);
    			add_location(td5, file$p, 101, 20, 3615);
    			add_location(tr1, file$p, 95, 16, 3229);
    			add_location(tbody, file$p, 94, 12, 3205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*updatedCountry*/ ctx[3]);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*updatedYear*/ ctx[4]);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*updatedmost_grand_slam*/ ctx[5]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*updatedmasters_finals*/ ctx[6]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*updatedolympic_gold_medals*/ ctx[7]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[14]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[15]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*updatedCountry*/ 8 && input0.value !== /*updatedCountry*/ ctx[3]) {
    				set_input_value(input0, /*updatedCountry*/ ctx[3]);
    			}

    			if (dirty & /*updatedYear*/ 16 && input1.value !== /*updatedYear*/ ctx[4]) {
    				set_input_value(input1, /*updatedYear*/ ctx[4]);
    			}

    			if (dirty & /*updatedmost_grand_slam*/ 32 && input2.value !== /*updatedmost_grand_slam*/ ctx[5]) {
    				set_input_value(input2, /*updatedmost_grand_slam*/ ctx[5]);
    			}

    			if (dirty & /*updatedmasters_finals*/ 64 && input3.value !== /*updatedmasters_finals*/ ctx[6]) {
    				set_input_value(input3, /*updatedmasters_finals*/ ctx[6]);
    			}

    			if (dirty & /*updatedolympic_gold_medals*/ 128 && input4.value !== /*updatedolympic_gold_medals*/ ctx[7]) {
    				set_input_value(input4, /*updatedolympic_gold_medals*/ ctx[7]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$b.name,
    		type: "slot",
    		source: "(82:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (77:18)      loading         {:then entry}
    function create_pending_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(77:18)      loading         {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (111:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$e(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(111:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let t4_value = /*params*/ ctx[0].year + "";
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let button;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[2],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[11],
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 10,
    		blocks: [,,,]
    	};

    	handle_promise(/*entry*/ ctx[10], info);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Editar entrada \"");
    			t2 = text(t2_value);
    			t3 = text("\",\"");
    			t4 = text(t4_value);
    			t5 = text("\"");
    			t6 = space();
    			info.block.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$p, 75, 4, 2700);
    			add_location(main, file$p, 68, 0, 2548);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t7;
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const alert_changes = {};
    			if (dirty & /*color*/ 4) alert_changes.color = /*color*/ ctx[2];
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[11];

    			if (dirty & /*$$scope, errorMsg*/ 1048832) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			update_await_block_branch(info, ctx, dirty);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Edit', slots, []);
    	let { params = {} } = $$props;
    	const BASEUrl = getBASEUrl();
    	let visible = false;
    	let color = "danger";
    	var BASE_API_PATH = `${BASEUrl}/api/v2/tennis`;
    	let entry = {};
    	let updatedCountry = {};
    	let updatedYear = "";
    	let updatedmost_grand_slam = "";
    	let updatedmasters_finals = "";
    	let updatedolympic_gold_medals = "";
    	let errorMsg = "";
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch(BASE_API_PATH + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			await res.json();
    			$$invalidate(5, updatedmost_grand_slam = entry.most_grand_slam);
    			$$invalidate(6, updatedmasters_finals = entry.masters_finals);
    			$$invalidate(7, updatedolympic_gold_medals = entry.olympic_gold_medals);
    		} else {
    			$$invalidate(1, visible = true);
    			$$invalidate(2, color = "danger");
    			$$invalidate(8, errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.country + " " + params.year);
    			console.log("ERROR" + errorMsg);
    		}
    	}

    	async function EditEntry() {
    		console.log("Updating entry...." + updatedCountry);

    		await fetch(BASE_API_PATH + "/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year: parseInt(params.year),
    				most_grand_slam: parseFloat(updatedmost_grand_slam),
    				masters_finals: parseFloat(updatedmasters_finals),
    				olympic_gold_medals: parseFloat(updatedolympic_gold_medals)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, visible = true);

    			if (res.status == 200) {
    				getEntries();
    				console.log("Data introduced");
    				$$invalidate(2, color = "success");
    				$$invalidate(8, errorMsg = "Recurso actualizado correctamente");
    			} else {
    				console.log("Data not edited");
    				$$invalidate(2, color = "danger");
    				$$invalidate(8, errorMsg = "Compruebe los campos");
    			}
    		});
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$e.warn(`<Edit> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		updatedCountry = this.value;
    		$$invalidate(3, updatedCountry);
    	}

    	function input1_input_handler() {
    		updatedYear = this.value;
    		$$invalidate(4, updatedYear);
    	}

    	function input2_input_handler() {
    		updatedmost_grand_slam = this.value;
    		$$invalidate(5, updatedmost_grand_slam);
    	}

    	function input3_input_handler() {
    		updatedmasters_finals = this.value;
    		$$invalidate(6, updatedmasters_finals);
    	}

    	function input4_input_handler() {
    		updatedolympic_gold_medals = this.value;
    		$$invalidate(7, updatedolympic_gold_medals);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		pop,
    		onMount,
    		Button,
    		Table,
    		Alert,
    		getBASEUrl,
    		BASEUrl,
    		visible,
    		color,
    		BASE_API_PATH,
    		entry,
    		updatedCountry,
    		updatedYear,
    		updatedmost_grand_slam,
    		updatedmasters_finals,
    		updatedolympic_gold_medals,
    		errorMsg,
    		getEntries,
    		EditEntry
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entry' in $$props) $$invalidate(10, entry = $$props.entry);
    		if ('updatedCountry' in $$props) $$invalidate(3, updatedCountry = $$props.updatedCountry);
    		if ('updatedYear' in $$props) $$invalidate(4, updatedYear = $$props.updatedYear);
    		if ('updatedmost_grand_slam' in $$props) $$invalidate(5, updatedmost_grand_slam = $$props.updatedmost_grand_slam);
    		if ('updatedmasters_finals' in $$props) $$invalidate(6, updatedmasters_finals = $$props.updatedmasters_finals);
    		if ('updatedolympic_gold_medals' in $$props) $$invalidate(7, updatedolympic_gold_medals = $$props.updatedolympic_gold_medals);
    		if ('errorMsg' in $$props) $$invalidate(8, errorMsg = $$props.errorMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visible,
    		color,
    		updatedCountry,
    		updatedYear,
    		updatedmost_grand_slam,
    		updatedmasters_finals,
    		updatedolympic_gold_medals,
    		errorMsg,
    		EditEntry,
    		entry,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class Edit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get params() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/productos/listaProductos.svelte generated by Svelte v3.59.2 */
    const file$o = "src/productos/listaProductos.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>     import { onMount }
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>     import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (50:4) {:then entries}
    function create_then_block$4(ctx) {
    	let alert;
    	let t0;
    	let table0;
    	let t1;
    	let table1;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[6],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[8],
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(alert.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			create_component(table1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(table1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_changes = {};
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[8];

    			if (dirty & /*$$scope, checkMSG*/ 2097153) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			const table0_changes = {};

    			if (dirty & /*$$scope, from, to, checkMSG, currentPage*/ 2097181) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty & /*$$scope, entries*/ 2097184) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(50:4) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#if checkMSG}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkMSG*/ 1) set_data_dev(t, /*checkMSG*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(53:8) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (52:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_4$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(52:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (68:35) <Button outline color="dark" on:click={() => {                     if (from === null || to === null) {                         window.alert('Los campos precio mínimo y máximo no pueden estar vacíos');                     } else {                         checkMSG = "Datos cargados correctamente en ese rango de precios";                         getEntries();                     }                 }}>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(68:35) <Button outline color=\\\"dark\\\" on:click={() => {                     if (from === null || to === null) {                         window.alert('Los campos precio mínimo y máximo no pueden estar vacíos');                     } else {                         checkMSG = \\\"Datos cargados correctamente en ese rango de precios\\\";                         getEntries();                     }                 }}>",
    		ctx
    	});

    	return block;
    }

    // (78:35) <Button outline color="info" on:click={() => {                  from = null;      to = null;      checkMSG = "Búsqueda limpiada";      currentPage = 1; // Agrega esta línea para restablecer la página actual      getEntries();     }}>
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(78:35) <Button outline color=\\\"info\\\" on:click={() => {                  from = null;      to = null;      checkMSG = \\\"Búsqueda limpiada\\\";      currentPage = 1; // Agrega esta línea para restablecer la página actual      getEntries();     }}>",
    		ctx
    	});

    	return block;
    }

    // (57:4) <Table bordered>
    function create_default_slot_1$a(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t4;
    	let td1;
    	let input1;
    	let t5;
    	let td2;
    	let button0;
    	let t6;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[11]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[12]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Precio mínimo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Precio máximo";
    			t3 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t4 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t5 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t6 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$o, 59, 16, 1462);
    			add_location(th1, file$o, 60, 16, 1501);
    			add_location(tr0, file$o, 58, 12, 1441);
    			add_location(thead, file$o, 57, 8, 1421);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "2000");
    			add_location(input0, file$o, 65, 20, 1612);
    			add_location(td0, file$o, 65, 16, 1608);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "2000");
    			add_location(input1, file$o, 66, 20, 1688);
    			add_location(td1, file$o, 66, 16, 1684);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$o, 67, 16, 1758);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$o, 77, 16, 2252);
    			add_location(tr1, file$o, 64, 12, 1587);
    			add_location(tbody, file$o, 63, 8, 1567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[3]);
    			append_dev(tr1, t4);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[4]);
    			append_dev(tr1, t5);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t6);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*from*/ 8 && to_number(input0.value) !== /*from*/ ctx[3]) {
    				set_input_value(input0, /*from*/ ctx[3]);
    			}

    			if (dirty & /*to*/ 16 && to_number(input1.value) !== /*to*/ ctx[4]) {
    				set_input_value(input1, /*to*/ ctx[4]);
    			}

    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(57:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (102:12) {#each entries as entry}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[18].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[18].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[18].price + "";
    	let t4;
    	let t5;
    	let t6;
    	let td3;
    	let t7_value = /*entry*/ ctx[18].description + "";
    	let t7;
    	let t8;
    	let td4;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = text("€");
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			img = element("img");
    			t9 = space();
    			add_location(td0, file$o, 103, 20, 2967);
    			add_location(td1, file$o, 104, 20, 3007);
    			add_location(td2, file$o, 105, 20, 3050);
    			add_location(td3, file$o, 106, 20, 3094);
    			if (!src_url_equal(img.src, img_src_value = /*entry*/ ctx[18].images)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*entry*/ ctx[18].description);
    			set_style(img, "width", "300px");
    			set_style(img, "height", "auto");
    			add_location(img, file$o, 107, 24, 3147);
    			add_location(td4, file$o, 107, 20, 3143);
    			add_location(tr, file$o, 102, 16, 2942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(td2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, img);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 32 && t0_value !== (t0_value = /*entry*/ ctx[18].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 32 && t2_value !== (t2_value = /*entry*/ ctx[18].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*entries*/ 32 && t4_value !== (t4_value = /*entry*/ ctx[18].price + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*entries*/ 32 && t7_value !== (t7_value = /*entry*/ ctx[18].description + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*entries*/ 32 && !src_url_equal(img.src, img_src_value = /*entry*/ ctx[18].images)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*entries*/ 32 && img_alt_value !== (img_alt_value = /*entry*/ ctx[18].description)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(102:12) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (91:4) <Table bordered>
    function create_default_slot$d(ctx) {
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let each_value_1 = /*entries*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Título";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Precio";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Descripción";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Foto";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$o, 93, 16, 2695);
    			add_location(th1, file$o, 94, 16, 2723);
    			add_location(th2, file$o, 95, 16, 2755);
    			add_location(th3, file$o, 96, 16, 2787);
    			add_location(th4, file$o, 97, 16, 2824);
    			add_location(tr, file$o, 92, 12, 2674);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$o, 91, 8, 2639);
    			add_location(tbody, file$o, 100, 8, 2881);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 32) {
    				each_value_1 = /*entries*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(91:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (48:20)          loading     {:then entries}
    function create_pending_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(48:20)          loading     {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (124:4) {#each Array(Math.ceil(entries.length / entriesPerPage)).fill() as _, index}
    function create_each_block$4(ctx) {
    	let button;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*currentPage*/ ctx[2]);
    			attr_dev(button, "class", "svelte-1y3e9bz");
    			toggle_class(button, "disabled", /*currentPage*/ ctx[2] === /*index*/ ctx[17]);
    			add_location(button, file$o, 124, 8, 3612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPage*/ 4) set_data_dev(t, /*currentPage*/ ctx[2]);

    			if (dirty & /*currentPage*/ 4) {
    				toggle_class(button, "disabled", /*currentPage*/ ctx[2] === /*index*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(124:4) {#each Array(Math.ceil(entries.length / entriesPerPage)).fill() as _, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let promise;
    	let t4;
    	let div;
    	let button0;
    	let t5;
    	let button0_disabled_value;
    	let t6;
    	let t7;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 5,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[5], info);
    	let each_value = Array(Math.ceil(/*entries*/ ctx[5].length / entriesPerPage)).fill();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Productos";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Productos que se encuentran a la venta";
    			t3 = space();
    			info.block.c();
    			t4 = space();
    			div = element("div");
    			button0 = element("button");
    			t5 = text("Anterior");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			button1 = element("button");
    			button1.textContent = "Siguiente";
    			add_location(h1, file$o, 40, 12, 1052);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$o, 39, 8, 1008);
    			add_location(p, file$o, 42, 8, 1101);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$o, 38, 4, 971);
    			button0.disabled = button0_disabled_value = /*currentPage*/ ctx[2] === 1;
    			attr_dev(button0, "class", "svelte-1y3e9bz");
    			add_location(button0, file$o, 114, 4, 3348);
    			attr_dev(button1, "class", "svelte-1y3e9bz");
    			add_location(button1, file$o, 128, 4, 3711);
    			attr_dev(div, "class", "pagination svelte-1y3e9bz");
    			add_location(div, file$o, 113, 0, 3319);
    			add_location(main, file$o, 37, 0, 960);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t4;
    			append_dev(main, t4);
    			append_dev(main, div);
    			append_dev(div, button0);
    			append_dev(button0, t5);
    			append_dev(div, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t7);
    			append_dev(div, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[13], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[14], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 32 && promise !== (promise = /*entries*/ ctx[5]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			if (!current || dirty & /*currentPage*/ 4 && button0_disabled_value !== (button0_disabled_value = /*currentPage*/ ctx[2] === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*currentPage, entries*/ 36) {
    				each_value = Array(Math.ceil(/*entries*/ ctx[5].length / entriesPerPage)).fill();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t7);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const entriesPerPage = 10;

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListaProductos', slots, []);
    	let entries = [];
    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let currentPage = 1;
    	let from = null;
    	let to = null;
    	onMount(getEntries);

    	async function getEntries() {
    		const response = await fetch("https://api.escuelajs.co/api/v1/products");
    		const data = await response.json();

    		if (Array.isArray(data)) {
    			$$invalidate(5, entries = data);
    		} else if (data.hasOwnProperty("entries")) {
    			$$invalidate(5, entries = data.entries);
    		}

    		if (from !== null && to !== null) {
    			$$invalidate(5, entries = entries.filter(entry => entry.price >= from && entry.price <= to));
    		}

    		const startIndex = (currentPage - 1) * entriesPerPage;
    		$$invalidate(5, entries = entries.slice(startIndex, startIndex + entriesPerPage));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListaProductos> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(3, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(4, to);
    	}

    	const click_handler = () => {
    		if (from === null || to === null) {
    			window.alert('Los campos precio mínimo y máximo no pueden estar vacíos');
    		} else {
    			$$invalidate(0, checkMSG = "Datos cargados correctamente en ese rango de precios");
    			getEntries();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(3, from = null);
    		$$invalidate(4, to = null);
    		$$invalidate(0, checkMSG = "Búsqueda limpiada");
    		$$invalidate(2, currentPage = 1); // Agrega esta línea para restablecer la página actual
    		getEntries();
    	};

    	const click_handler_2 = () => {
    		$$invalidate(2, currentPage -= 1);
    		getEntries();
    	};

    	const click_handler_3 = () => {
    		$$invalidate(2, currentPage += 1);
    		getEntries();
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		entries,
    		checkMSG,
    		visible,
    		color,
    		currentPage,
    		entriesPerPage,
    		from,
    		to,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(5, entries = $$props.entries);
    		if ('checkMSG' in $$props) $$invalidate(0, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('currentPage' in $$props) $$invalidate(2, currentPage = $$props.currentPage);
    		if ('from' in $$props) $$invalidate(3, from = $$props.from);
    		if ('to' in $$props) $$invalidate(4, to = $$props.to);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		checkMSG,
    		visible,
    		currentPage,
    		from,
    		to,
    		entries,
    		color,
    		getEntries,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class ListaProductos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListaProductos",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src/tennis/chart.svelte generated by Svelte v3.59.2 */

    const { console: console_1$d, document: document_1$2 } = globals;
    const file$n = "src/tennis/chart.svelte";

    // (74:8) <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"             >
    function create_default_slot_1$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Pagina de visualizaciones");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(74:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Visualizaciones\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (77:8) <Button outline color="btn btn-outline-primary" href="/#/Tennis"             >
    function create_default_slot$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Front-end Tennis");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(77:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Tennis\\\"             >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let div;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let h2;
    	let t5;
    	let h4;
    	let t7;
    	let canvas;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Visualizaciones",
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Tennis",
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			h2 = element("h2");
    			h2.textContent = "Más torneos ganados";
    			t5 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Chart.js";
    			t7 = space();
    			canvas = element("canvas");
    			if (!src_url_equal(script.src, script_src_value = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$n, 65, 4, 2385);
    			add_location(br, file$n, 71, 4, 2539);
    			attr_dev(div, "class", "button-container svelte-6g4zwj");
    			add_location(div, file$n, 72, 4, 2548);
    			attr_dev(h2, "class", "svelte-6g4zwj");
    			add_location(h2, file$n, 80, 4, 2854);
    			attr_dev(h4, "class", "svelte-6g4zwj");
    			add_location(h4, file$n, 81, 4, 2887);
    			attr_dev(canvas, "id", "myChart");
    			add_location(canvas, file$n, 85, 4, 3082);
    			add_location(main, file$n, 70, 0, 2528);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1$2.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			append_dev(main, div);
    			mount_component(button0, div, null);
    			append_dev(div, t2);
    			mount_component(button1, div, null);
    			append_dev(main, t3);
    			append_dev(main, h2);
    			append_dev(main, t5);
    			append_dev(main, h4);
    			append_dev(main, t7);
    			append_dev(main, canvas);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*loadGraph*/ ctx[0], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart', slots, []);
    	const BASEUrl = getBASEUrl();
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_country_date = [];
    	let stats_most_grand_slam = [];
    	let stats_masters_finals = [];
    	let stats_olympic_gold_medals = [];

    	async function getStats() {
    		console.log("Fetching stats....");
    		const res = await fetch(`${BASEUrl}/api/v2/tennis`);

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			data.forEach(stat => {
    				stats_country_date.push(stat.country + "-" + stat.year);
    				stats_most_grand_slam.push(stat["most_grand_slam"]);
    				stats_masters_finals.push(stat["masters_finals"]);
    				stats_olympic_gold_medals.push(stat["olympic_gold_medals"]);
    			});

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var ctx = document.getElementById("myChart").getContext("2d");

    		new Chart(ctx,
    		{
    				type: "bar",
    				data: {
    					labels: stats_country_date,
    					datasets: [
    						{
    							label: "Grandslams ganados",
    							backgroundColor: "rgb(0, 128, 128)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_most_grand_slam
    						},
    						{
    							label: "Masters ganados",
    							backgroundColor: "rgb(255, 0 ,0)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_masters_finals
    						},
    						{
    							label: "Medallas olimpicas",
    							backgroundColor: "rgb(255, 255, 0)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_olympic_gold_medals
    						}
    					]
    				},
    				options: {}
    			});
    	}

    	onMount(getStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$d.warn(`<Chart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getBASEUrl,
    		BASEUrl,
    		Button,
    		onMount,
    		delay,
    		data,
    		stats_country_date,
    		stats_most_grand_slam,
    		stats_masters_finals,
    		stats_olympic_gold_medals,
    		getStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_most_grand_slam' in $$props) stats_most_grand_slam = $$props.stats_most_grand_slam;
    		if ('stats_masters_finals' in $$props) stats_masters_finals = $$props.stats_masters_finals;
    		if ('stats_olympic_gold_medals' in $$props) stats_olympic_gold_medals = $$props.stats_olympic_gold_medals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class Chart_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_1",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/tennis/chart2.svelte generated by Svelte v3.59.2 */

    const { console: console_1$c } = globals;
    const file$m = "src/tennis/chart2.svelte";

    // (108:8) <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"             >
    function create_default_slot_1$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Pagina de visualizaciones");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(108:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Visualizaciones\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (111:8) <Button outline color="btn btn-outline-primary" href="/#/Tennis"             >
    function create_default_slot$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Front-end Tennis");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(111:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Tennis\\\"             >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let div0;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let figure;
    	let div1;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Visualizaciones",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Tennis",
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			figure = element("figure");
    			div1 = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$m, 95, 4, 2976);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$m, 96, 4, 3047);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$m, 97, 4, 3128);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$m, 98, 4, 3206);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$m, 99, 4, 3285);
    			add_location(br, file$m, 105, 4, 3395);
    			attr_dev(div0, "class", "button-container svelte-1xkotvb");
    			add_location(div0, file$m, 106, 4, 3404);
    			attr_dev(div1, "id", "container");
    			add_location(div1, file$m, 115, 8, 3753);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$m, 114, 4, 3710);
    			add_location(main, file$m, 104, 0, 3384);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t2);
    			mount_component(button1, div0, null);
    			append_dev(main, t3);
    			append_dev(main, figure);
    			append_dev(figure, div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart2', slots, []);
    	const BASEUrl = getBASEUrl();
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_country_date = [];
    	let stats_most_grand_slam = [];
    	let stats_olympic_gold_medals = [];
    	let stats_masters_finals = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res = await fetch(`${BASEUrl}/api/v2/tennis`);

    		if (res.ok) {
    			const data = await res.json();
    			stats = data;
    			console.log("Estadísticas recibidas: " + stats.length);

    			//inicializamos los arrays para mostrar los datos
    			stats.forEach(stat => {
    				stats_country_date.push(stat.country + "-" + stat.year);
    				stats_most_grand_slam.push(stat["most_grand_slam"]);
    				stats_masters_finals.push(stat["masters_finals"]);
    				stats_olympic_gold_medals.push(stat["olympic_gold_medals"]);
    			});

    			//esperamos para que se carrguen los datos 
    			await delay(500);

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart('container', {
    			chart: { type: 'area' },
    			title: { text: 'Más torneos ganados' },
    			subtitle: { text: 'Biblioteca: Highcharts' },
    			yAxis: { title: { text: 'Valor' } },
    			xAxis: {
    				title: { text: "País-Año" },
    				categories: stats_country_date
    			},
    			legend: {
    				layout: 'vertical',
    				align: 'right',
    				verticalAlign: 'middle'
    			},
    			series: [
    				{
    					name: 'Más grand slams',
    					data: stats_most_grand_slam
    				},
    				{
    					name: 'Finales de masters',
    					data: stats_masters_finals
    				},
    				{
    					name: 'Medallas olimpicas',
    					data: stats_olympic_gold_medals
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: 'horizontal',
    								align: 'center',
    								verticalAlign: 'bottom'
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$c.warn(`<Chart2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getBASEUrl,
    		BASEUrl,
    		Button,
    		onMount,
    		delay,
    		stats,
    		stats_country_date,
    		stats_most_grand_slam,
    		stats_olympic_gold_medals,
    		stats_masters_finals,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_most_grand_slam' in $$props) stats_most_grand_slam = $$props.stats_most_grand_slam;
    		if ('stats_olympic_gold_medals' in $$props) stats_olympic_gold_medals = $$props.stats_olympic_gold_medals;
    		if ('stats_masters_finals' in $$props) stats_masters_finals = $$props.stats_masters_finals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Chart2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart2",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/twitch/twitchHub.svelte generated by Svelte v3.59.2 */

    const file$l = "src/twitch/twitchHub.svelte";

    function create_fragment$l(ctx) {
    	let main;
    	let div0;
    	let h1;
    	let t0;
    	let a0;
    	let button0;
    	let t2;
    	let br0;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let p2;
    	let t9;
    	let ol;
    	let li0;
    	let b0;
    	let t11;
    	let t12;
    	let li1;
    	let b1;
    	let t14;
    	let t15;
    	let li2;
    	let b2;
    	let t17;
    	let t18;
    	let li3;
    	let b3;
    	let t20;
    	let t21;
    	let li4;
    	let b4;
    	let t23;
    	let t24;
    	let br1;
    	let t25;
    	let div3;
    	let div1;
    	let h20;
    	let t27;
    	let img0;
    	let img0_src_value;
    	let t28;
    	let p3;
    	let t30;
    	let a1;
    	let button1;
    	let t32;
    	let div2;
    	let h21;
    	let t34;
    	let img1;
    	let img1_src_value;
    	let t35;
    	let p4;
    	let t37;
    	let a2;
    	let button2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("Twitch API\n            ");
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "Documentación";
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "La interacción en vivo y la transmisión de contenido han adquirido una importancia sin precedentes. Plataformas como Twitch han revolucionado la manera en que las personas se conectan, comparten y consumen contenido en tiempo real.";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Esta API ofrece un acceso estructurado a diversos datos y funciones clave dentro de Twitch, lo que permite aprovechar al máximo las posibilidades de la plataforma y brindar a los usuarios experiencias más personalizadas y enriquecedoras.";
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "Entre las capacidades que ofrece la Twitch API se encuentran:";
    			t9 = space();
    			ol = element("ol");
    			li0 = element("li");
    			b0 = element("b");
    			b0.textContent = "Obtención de Datos en Tiempo Real:";
    			t11 = text("Permite acceder a datos en tiempo real sobre transmisiones en vivo, espectadores, seguidores y chats.");
    			t12 = space();
    			li1 = element("li");
    			b1 = element("b");
    			b1.textContent = "Interacción con la Audiencia:";
    			t14 = text(" La API permite construir herramientas para interactuar con la audiencia de una manera única.");
    			t15 = space();
    			li2 = element("li");
    			b2 = element("b");
    			b2.textContent = "Creación de Extensiones: ";
    			t17 = text("Las extensiones de Twitch son módulos interactivos que los streamers pueden incorporar en sus transmisiones para enriquecer la experiencia de sus espectadores. La Twitch API permite crear y personalizar estas extensiones, ofreciendo desde sorteos y encuestas hasta minijuegos y listas de reproducción de videos.\"");
    			t18 = space();
    			li3 = element("li");
    			b3 = element("b");
    			b3.textContent = "Análisis y Monitoreo: ";
    			t20 = text("La API también proporciona acceso a datos analíticos que permiten entender mejor cómo los usuarios interactúan con el contenido.");
    			t21 = space();
    			li4 = element("li");
    			b4 = element("b");
    			b4.textContent = "Oauth:";
    			t23 = text(" La api cuenta con Open Authorization, que es un estándar abierto que permite flujos simples de autorización para sitios web o aplicaciones informáticas.");
    			t24 = space();
    			br1 = element("br");
    			t25 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Lista de Clips";
    			t27 = space();
    			img0 = element("img");
    			t28 = space();
    			p3 = element("p");
    			p3.textContent = "Muestra en formato tabla y ordenados por número de visitas los clips de la categoria 'Tennis'.";
    			t30 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Ver más";
    			t32 = space();
    			div2 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Gráfica de Clips";
    			t34 = space();
    			img1 = element("img");
    			t35 = space();
    			p4 = element("p");
    			p4.textContent = "Muestra una gráfica de tipo barra los clips de la categoria tennis con más visitas.";
    			t37 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "Ver más";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-success");
    			add_location(button0, file$l, 74, 76, 1454);
    			attr_dev(a0, "class", "documentacion svelte-11gwpuj");
    			attr_dev(a0, "href", "https://dev.twitch.tv/docs/api/");
    			add_location(a0, file$l, 74, 12, 1390);
    			attr_dev(h1, "class", "svelte-11gwpuj");
    			add_location(h1, file$l, 72, 8, 1350);
    			add_location(br0, file$l, 76, 8, 1549);
    			attr_dev(p0, "class", "svelte-11gwpuj");
    			add_location(p0, file$l, 77, 4, 1558);
    			attr_dev(p1, "class", "svelte-11gwpuj");
    			add_location(p1, file$l, 79, 4, 1802);
    			attr_dev(p2, "class", "svelte-11gwpuj");
    			add_location(p2, file$l, 81, 4, 2052);
    			add_location(b0, file$l, 83, 16, 2146);
    			attr_dev(li0, "class", "svelte-11gwpuj");
    			add_location(li0, file$l, 83, 12, 2142);
    			add_location(b1, file$l, 84, 16, 2310);
    			attr_dev(li1, "class", "svelte-11gwpuj");
    			add_location(li1, file$l, 84, 12, 2306);
    			add_location(b2, file$l, 85, 16, 2462);
    			attr_dev(li2, "class", "svelte-11gwpuj");
    			add_location(li2, file$l, 85, 12, 2458);
    			add_location(b3, file$l, 86, 17, 2829);
    			attr_dev(li3, "class", "svelte-11gwpuj");
    			add_location(li3, file$l, 86, 12, 2824);
    			add_location(b4, file$l, 87, 17, 3010);
    			attr_dev(li4, "class", "svelte-11gwpuj");
    			add_location(li4, file$l, 87, 12, 3005);
    			attr_dev(ol, "class", "svelte-11gwpuj");
    			add_location(ol, file$l, 82, 4, 2125);
    			attr_dev(div0, "class", "container svelte-11gwpuj");
    			add_location(div0, file$l, 71, 4, 1318);
    			add_location(br1, file$l, 91, 0, 3206);
    			attr_dev(h20, "class", "card-title svelte-11gwpuj");
    			add_location(h20, file$l, 94, 12, 3284);
    			attr_dev(img0, "class", "card-image svelte-11gwpuj");
    			if (!src_url_equal(img0.src, img0_src_value = "https://editors.dexerto.com/wp-content/uploads/2021/01/TwitchClipGuide.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Imagen de Clips");
    			add_location(img0, file$l, 95, 12, 3339);
    			attr_dev(p3, "class", "card-content svelte-11gwpuj");
    			add_location(p3, file$l, 96, 12, 3479);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary");
    			add_location(button1, file$l, 97, 62, 3664);
    			attr_dev(a1, "href", "http://antoniosaborido.es:8081/#/Twitch");
    			add_location(a1, file$l, 97, 12, 3614);
    			attr_dev(div1, "class", "card svelte-11gwpuj");
    			add_location(div1, file$l, 93, 8, 3253);
    			attr_dev(h21, "class", "card-title svelte-11gwpuj");
    			add_location(h21, file$l, 101, 12, 3786);
    			attr_dev(img1, "class", "card-image svelte-11gwpuj");
    			if (!src_url_equal(img1.src, img1_src_value = "https://i.ibb.co/mBzsRjy/Captura-de-pantalla-2023-08-25-064518.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "TennisAPI Image");
    			add_location(img1, file$l, 102, 12, 3843);
    			attr_dev(p4, "class", "card-content svelte-11gwpuj");
    			add_location(p4, file$l, 103, 12, 3975);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-primary");
    			add_location(button2, file$l, 104, 67, 4154);
    			attr_dev(a2, "href", "http://antoniosaborido.es:8081/#/twitchchart");
    			add_location(a2, file$l, 104, 12, 4099);
    			attr_dev(div2, "class", "card svelte-11gwpuj");
    			add_location(div2, file$l, 100, 8, 3755);
    			attr_dev(div3, "class", "cards-container svelte-11gwpuj");
    			add_location(div3, file$l, 92, 4, 3215);
    			attr_dev(main, "class", "svelte-11gwpuj");
    			add_location(main, file$l, 70, 0, 1307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, a0);
    			append_dev(a0, button0);
    			append_dev(div0, t2);
    			append_dev(div0, br0);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(div0, t7);
    			append_dev(div0, p2);
    			append_dev(div0, t9);
    			append_dev(div0, ol);
    			append_dev(ol, li0);
    			append_dev(li0, b0);
    			append_dev(li0, t11);
    			append_dev(ol, t12);
    			append_dev(ol, li1);
    			append_dev(li1, b1);
    			append_dev(li1, t14);
    			append_dev(ol, t15);
    			append_dev(ol, li2);
    			append_dev(li2, b2);
    			append_dev(li2, t17);
    			append_dev(ol, t18);
    			append_dev(ol, li3);
    			append_dev(li3, b3);
    			append_dev(li3, t20);
    			append_dev(ol, t21);
    			append_dev(ol, li4);
    			append_dev(li4, b4);
    			append_dev(li4, t23);
    			append_dev(main, t24);
    			append_dev(main, br1);
    			append_dev(main, t25);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t27);
    			append_dev(div1, img0);
    			append_dev(div1, t28);
    			append_dev(div1, p3);
    			append_dev(div1, t30);
    			append_dev(div1, a1);
    			append_dev(a1, button1);
    			append_dev(div3, t32);
    			append_dev(div3, div2);
    			append_dev(div2, h21);
    			append_dev(div2, t34);
    			append_dev(div2, img1);
    			append_dev(div2, t35);
    			append_dev(div2, p4);
    			append_dev(div2, t37);
    			append_dev(div2, a2);
    			append_dev(a2, button2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TwitchHub', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TwitchHub> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class TwitchHub extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TwitchHub",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/twitch/twitch.svelte generated by Svelte v3.59.2 */

    const { console: console_1$b } = globals;
    const file$k = "src/twitch/twitch.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (44:1) {:then entries}
    function create_then_block$3(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(44:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (59:3) {#each entries as entry}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].view_count + "";
    	let t2;
    	let t3;
    	let td2;
    	let iframe;
    	let iframe_src_value;
    	let t4;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			iframe = element("iframe");
    			t4 = space();
    			add_location(td0, file$k, 60, 5, 1189);
    			add_location(td1, file$k, 61, 5, 1217);
    			if (!src_url_equal(iframe.src, iframe_src_value = `https://clips.twitch.tv/embed?clip=${/*entry*/ ctx[3].id}&parent=antoniosaborido.es}`)) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "360");
    			attr_dev(iframe, "width", "640");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "title", "Twitch Clip");
    			add_location(iframe, file$k, 63, 6, 1276);
    			add_location(td2, file$k, 62, 20, 1265);
    			add_location(tr, file$k, 59, 4, 1179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, iframe);
    			append_dev(tr, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].view_count + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = `https://clips.twitch.tv/embed?clip=${/*entry*/ ctx[3].id}&parent=antoniosaborido.es}`)) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(59:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (45:1) <Table bordered>
    function create_default_slot$a(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let tbody;
    	let tr1;
    	let t6;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Numero de visitas";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Clip";
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$k, 50, 4, 1031);
    			add_location(th1, file$k, 51, 4, 1051);
    			add_location(th2, file$k, 52, 4, 1082);
    			add_location(tr0, file$k, 48, 3, 1017);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$k, 47, 2, 991);
    			add_location(tr1, file$k, 56, 3, 1131);
    			add_location(tbody, file$k, 55, 2, 1120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(45:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (42:16)  loading  {:then entries}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(42:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let td;
    	let a;
    	let t3;
    	let br;
    	let t4;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Clips: Twitch";
    			t1 = space();
    			td = element("td");
    			a = element("a");
    			a.textContent = "Volver";
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			info.block.c();
    			add_location(h1, file$k, 27, 4, 685);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$k, 26, 2, 649);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$k, 25, 1, 618);
    			attr_dev(a, "href", "/#/TwitchHub");
    			attr_dev(a, "class", "btn btn-primary btn-lg active");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "aria-pressed", "true");
    			add_location(a, file$k, 32, 2, 765);
    			attr_dev(td, "align", "center");
    			add_location(td, file$k, 31, 3, 743);
    			add_location(br, file$k, 40, 1, 918);
    			add_location(main, file$k, 23, 0, 609);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, td);
    			append_dev(td, a);
    			append_dev(main, t3);
    			append_dev(main, br);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Twitch', slots, []);
    	const BASEUrl = getBASEUrl();
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch(`${BASEUrl}/api/v1/tennis-twitch`);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$b.warn(`<Twitch> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		getBASEUrl,
    		BASEUrl,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Twitch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Twitch",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/twitch/twitchchart.svelte generated by Svelte v3.59.2 */

    const { console: console_1$a, document: document_1$1 } = globals;
    const file$j = "src/twitch/twitchchart.svelte";

    function create_fragment$j(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let h2;
    	let t2;
    	let h4;
    	let t4;
    	let a;
    	let t6;
    	let br;
    	let t7;
    	let canvas;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Más visitas";
    			t2 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Chart.js";
    			t4 = space();
    			a = element("a");
    			a.textContent = "Volver";
    			t6 = space();
    			br = element("br");
    			t7 = space();
    			canvas = element("canvas");
    			if (!src_url_equal(script.src, script_src_value = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$j, 51, 4, 1615);
    			attr_dev(h2, "class", "svelte-1f1idld");
    			add_location(h2, file$j, 57, 4, 1769);
    			attr_dev(h4, "class", "svelte-1f1idld");
    			add_location(h4, file$j, 58, 4, 1794);
    			attr_dev(a, "href", "/#/TwitchHub");
    			attr_dev(a, "class", "btn btn-primary btn-lg active");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "aria-pressed", "true");
    			add_location(a, file$j, 61, 4, 1988);
    			add_location(br, file$j, 67, 8, 2139);
    			attr_dev(canvas, "id", "myChart");
    			add_location(canvas, file$j, 68, 4, 2148);
    			add_location(main, file$j, 56, 0, 1758);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1$1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t2);
    			append_dev(main, h4);
    			append_dev(main, t4);
    			append_dev(main, a);
    			append_dev(main, t6);
    			append_dev(main, br);
    			append_dev(main, t7);
    			append_dev(main, canvas);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*loadGraph*/ ctx[0], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Twitchchart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_title = [];
    	let stats_views = [];
    	const BASEUrl = getBASEUrl();

    	async function getStats() {
    		console.log("Fetching stats....");
    		const res = await fetch(`${BASEUrl}/api/v1/tennis-twitch`);

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			data.forEach(stat => {
    				stats_title.push(stat.title);
    				stats_views.push(stat["view_count"]);
    			});

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var ctx = document.getElementById("myChart").getContext("2d");

    		new Chart(ctx,
    		{
    				type: "bar",
    				data: {
    					labels: stats_title,
    					datasets: [
    						{
    							label: "Visitas",
    							backgroundColor: "rgba(0, 145, 255, 0.2)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_views
    						}
    					]
    				},
    				options: { scales: { y: { beginAtZero: true } } }
    			});
    	}

    	onMount(getStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<Twitchchart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		data,
    		stats_title,
    		stats_views,
    		getBASEUrl,
    		BASEUrl,
    		getStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_title' in $$props) stats_title = $$props.stats_title;
    		if ('stats_views' in $$props) stats_views = $$props.stats_views;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class Twitchchart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Twitchchart",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/topTennis/topHub.svelte generated by Svelte v3.59.2 */
    const file$i = "src/topTennis/topHub.svelte";

    function create_fragment$i(ctx) {
    	let main;
    	let div0;
    	let h1;
    	let t0;
    	let a0;
    	let button0;
    	let t2;
    	let br0;
    	let t3;
    	let p0;
    	let t5;
    	let br1;
    	let t6;
    	let div3;
    	let div1;
    	let h20;
    	let t8;
    	let img0;
    	let img0_src_value;
    	let t9;
    	let p1;
    	let t11;
    	let a1;
    	let button1;
    	let t13;
    	let div2;
    	let h21;
    	let t15;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let p2;
    	let t18;
    	let a2;
    	let button2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("TOP Tennis\n            ");
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "Documentación";
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Esta Api pertenece a Rapidapi y proporciona toda la información sobre el mundo del tenis, incluyendo todos los detalles relacionados con jugadores y torneos (puntuaciones en vivo, partidos, estadísticas) de los circuitos ATP, tanto individuales como dobles.";
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Lista ATP";
    			t8 = space();
    			img0 = element("img");
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "El Pepperstone ATP Rankings es el tradicional método ATP basado en méritos para determinar la entrada y el orden de cabezas de serie en todos los torneos.";
    			t11 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Ver más";
    			t13 = space();
    			div2 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Gráfica ATP";
    			t15 = space();
    			img1 = element("img");
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "Muestra una gráfica de tipo radar con los tenistas con más puntos en el ranking ATP.";
    			t18 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "Ver más";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-success");
    			add_location(button0, file$i, 75, 112, 1495);
    			attr_dev(a0, "class", "documentacion svelte-1qt2div");
    			attr_dev(a0, "href", "https://rapidapi.com/cantagalloedoardo/api/ultimate-tennis1/details");
    			add_location(a0, file$i, 75, 12, 1395);
    			attr_dev(h1, "class", "svelte-1qt2div");
    			add_location(h1, file$i, 73, 8, 1355);
    			add_location(br0, file$i, 77, 8, 1590);
    			attr_dev(p0, "class", "svelte-1qt2div");
    			add_location(p0, file$i, 78, 4, 1599);
    			attr_dev(div0, "class", "container svelte-1qt2div");
    			add_location(div0, file$i, 72, 4, 1323);
    			add_location(br1, file$i, 80, 0, 1871);
    			attr_dev(h20, "class", "card-title svelte-1qt2div");
    			add_location(h20, file$i, 83, 12, 1949);
    			attr_dev(img0, "class", "card-image svelte-1qt2div");
    			if (!src_url_equal(img0.src, img0_src_value = "https://www.atptour.com/es/news/www.atptour.com/-/media/images/news/2019/11/25/02/05/year-end-top-10-2019-web.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Imagen de Clips");
    			add_location(img0, file$i, 84, 12, 1999);
    			attr_dev(p1, "class", "card-content svelte-1qt2div");
    			add_location(p1, file$i, 85, 12, 2178);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary");
    			add_location(button1, file$i, 86, 70, 2431);
    			attr_dev(a1, "href", "http://antoniosaborido.es:8081/#/topTennis/list");
    			add_location(a1, file$i, 86, 12, 2373);
    			attr_dev(div1, "class", "card svelte-1qt2div");
    			add_location(div1, file$i, 82, 8, 1918);
    			attr_dev(h21, "class", "card-title svelte-1qt2div");
    			add_location(h21, file$i, 90, 12, 2553);
    			attr_dev(img1, "class", "card-image svelte-1qt2div");
    			if (!src_url_equal(img1.src, img1_src_value = "https://i.ytimg.com/vi/uCyYSiueR2s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB0YjbJ8BvLMmFHnLq4kY7QOSat9A")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "TennisAPI Image");
    			add_location(img1, file$i, 91, 12, 2605);
    			attr_dev(p2, "class", "card-content svelte-1qt2div");
    			add_location(p2, file$i, 92, 12, 2810);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-primary");
    			add_location(button2, file$i, 93, 71, 2994);
    			attr_dev(a2, "href", "http://antoniosaborido.es:8081/#/topTennis/chart");
    			add_location(a2, file$i, 93, 12, 2935);
    			attr_dev(div2, "class", "card svelte-1qt2div");
    			add_location(div2, file$i, 89, 8, 2522);
    			attr_dev(div3, "class", "cards-container svelte-1qt2div");
    			add_location(div3, file$i, 81, 4, 1880);
    			attr_dev(main, "class", "svelte-1qt2div");
    			add_location(main, file$i, 71, 0, 1312);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, a0);
    			append_dev(a0, button0);
    			append_dev(div0, t2);
    			append_dev(div0, br0);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(main, t5);
    			append_dev(main, br1);
    			append_dev(main, t6);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t8);
    			append_dev(div1, img0);
    			append_dev(div1, t9);
    			append_dev(div1, p1);
    			append_dev(div1, t11);
    			append_dev(div1, a1);
    			append_dev(a1, button1);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, h21);
    			append_dev(div2, t15);
    			append_dev(div2, img1);
    			append_dev(div2, t16);
    			append_dev(div2, p2);
    			append_dev(div2, t18);
    			append_dev(div2, a2);
    			append_dev(a2, button2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopHub', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopHub> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class TopHub$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopHub",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/topTennis/topList.svelte generated by Svelte v3.59.2 */

    const { console: console_1$9 } = globals;
    const file$h = "src/topTennis/topList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (30:8) <Button outline color="btn btn-outline-primary" href="/#/topTennis"             >
    function create_default_slot_1$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(30:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/topTennis\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (43:1) {:then entries}
    function create_then_block$2(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 129) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(43:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (60:3) {#each entries as entry}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[4].Rank + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[4].Name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[4].Age + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[4].Points + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			add_location(td0, file$h, 61, 5, 1266);
    			add_location(td1, file$h, 62, 5, 1293);
    			add_location(td2, file$h, 63, 20, 1335);
    			add_location(td3, file$h, 64, 5, 1361);
    			add_location(tr, file$h, 60, 4, 1256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[4].Rank + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[4].Name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*entries*/ 1 && t4_value !== (t4_value = /*entry*/ ctx[4].Age + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[4].Points + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(60:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (44:1) <Table bordered>
    function create_default_slot$9(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let tr1;
    	let t8;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Ranking";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Nombre";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Edad";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Puntos";
    			t7 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$h, 49, 4, 1071);
    			add_location(th1, file$h, 50, 4, 1092);
    			add_location(th2, file$h, 51, 4, 1112);
    			add_location(th3, file$h, 52, 16, 1142);
    			add_location(tr0, file$h, 47, 3, 1057);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$h, 46, 2, 1031);
    			add_location(tr1, file$h, 57, 3, 1208);
    			add_location(tbody, file$h, 56, 2, 1197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(44:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (41:16)  loading  {:then entries}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(41:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let main;
    	let br;
    	let t0;
    	let div;
    	let button;
    	let t1;
    	let figure;
    	let blockquote;
    	let h1;
    	let t3;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/topTennis",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			br = element("br");
    			t0 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			t1 = space();
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Clasificación tennis masculina";
    			t3 = space();
    			info.block.c();
    			add_location(br, file$h, 27, 1, 660);
    			attr_dev(div, "class", "button-container svelte-pw02me");
    			add_location(div, file$h, 28, 1, 666);
    			add_location(h1, file$h, 35, 4, 890);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$h, 34, 2, 854);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$h, 33, 1, 823);
    			add_location(main, file$h, 26, 0, 652);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t0);
    			append_dev(main, div);
    			mount_component(button, div, null);
    			append_dev(main, t1);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopList', slots, []);
    	let entries = [];
    	onMount(getEntries);
    	const BASEUrl = getBASEUrl();
    	var BASE_API_PATH = `${BASEUrl}/api/v1/tennisLiveRanking`;

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch(BASE_API_PATH);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<TopList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getBASEUrl,
    		BASEUrl,
    		BASE_API_PATH,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class TopList$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopList",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/topTennis/topChart.svelte generated by Svelte v3.59.2 */

    const { console: console_1$8, document: document_1 } = globals;
    const file$g = "src/topTennis/topChart.svelte";

    // (65:8) <Button outline color="btn btn-outline-primary" href="/#/topTennis"             >
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(65:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/topTennis\\\"             >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let div;
    	let button;
    	let t2;
    	let h2;
    	let t4;
    	let h4;
    	let t6;
    	let canvas;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/topTennis",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "Ranking ATP";
    			t4 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Chart.js";
    			t6 = space();
    			canvas = element("canvas");
    			if (!src_url_equal(script.src, script_src_value = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$g, 55, 4, 1782);
    			add_location(br, file$g, 62, 4, 1941);
    			attr_dev(div, "class", "button-container svelte-1iue9nj");
    			add_location(div, file$g, 63, 4, 1952);
    			attr_dev(h2, "class", "svelte-1iue9nj");
    			add_location(h2, file$g, 68, 4, 2112);
    			attr_dev(h4, "class", "svelte-1iue9nj");
    			add_location(h4, file$g, 69, 4, 2137);
    			attr_dev(canvas, "id", "myChart");
    			add_location(canvas, file$g, 73, 4, 2332);
    			attr_dev(main, "class", "svelte-1iue9nj");
    			add_location(main, file$g, 61, 0, 1930);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			append_dev(main, div);
    			mount_component(button, div, null);
    			append_dev(main, t2);
    			append_dev(main, h2);
    			append_dev(main, t4);
    			append_dev(main, h4);
    			append_dev(main, t6);
    			append_dev(main, canvas);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*loadGraph*/ ctx[0], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopChart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_name = [];
    	let stats_points = [];
    	const BASEUrl = getBASEUrl();
    	var BASE_API_PATH = `${BASEUrl}/api/v1/tennisLiveRanking`;

    	async function getStats() {
    		console.log("Fetching stats....");
    		const res = await fetch(BASE_API_PATH);

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			data.forEach(stat => {
    				stats_name.push(stat.Name);
    				stats_points.push(stat["Rank"]);
    			});

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var ctx = document.getElementById("myChart").getContext("2d");

    		new Chart(ctx,
    		{
    				type: "radar",
    				data: {
    					labels: stats_name.slice(0, 10),
    					datasets: [
    						{
    							label: "Ranking",
    							backgroundColor: "rgba(255, 51, 79)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_points.slice(0, 10)
    						}
    					]
    				},
    				options: { scales: { y: { beginAtZero: true } } }
    			});
    	}

    	onMount(getStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<TopChart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		data,
    		stats_name,
    		stats_points,
    		getBASEUrl,
    		Button,
    		BASEUrl,
    		BASE_API_PATH,
    		getStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_name' in $$props) stats_name = $$props.stats_name;
    		if ('stats_points' in $$props) stats_points = $$props.stats_points;
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class TopChart$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopChart",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/tennisFem/topHub.svelte generated by Svelte v3.59.2 */
    const file$f = "src/tennisFem/topHub.svelte";

    function create_fragment$f(ctx) {
    	let main;
    	let div0;
    	let h20;
    	let t0;
    	let a0;
    	let button0;
    	let t2;
    	let br0;
    	let t3;
    	let p0;
    	let t5;
    	let br1;
    	let t6;
    	let div3;
    	let div1;
    	let h21;
    	let t8;
    	let img0;
    	let img0_src_value;
    	let t9;
    	let p1;
    	let t11;
    	let a1;
    	let button1;
    	let t13;
    	let div2;
    	let h22;
    	let t15;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let p2;
    	let t18;
    	let a2;
    	let button2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			h20 = element("h2");
    			t0 = text("Clasificación Tenis Femenino (WTA)\n            ");
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "Documentación";
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Esta Api pertenece a Rapidapi y proporciona toda la información sobre el mundo del deporte, incluyendo todos los detalles relacionados con jugadores y torneos (puntuaciones en vivo, partidos, estadísticas). Pero en este caso nos centramos en la información de los circuitos WTA.";
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Lista WTA";
    			t8 = space();
    			img0 = element("img");
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "La Clasificación de la WTA es una clasificación mundial de tenistas profesionales femeninas que publica la Women's Tennis Association desde 1975. Se actualiza cada semana y abarca los resultados de las últimas 52 semanas. Se utiliza para seleccionar a los habilitados en cada torneo y a los cabezas de serie.";
    			t11 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Ver más";
    			t13 = space();
    			div2 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Gráfica ATP Femenina";
    			t15 = space();
    			img1 = element("img");
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "Muestra una gráfica de tipo Spline con las diez tenistas con más puntos en el ranking WTA del circuito así con sus correspondientes puentos en la gráfica.";
    			t18 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "Ver más";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-success");
    			add_location(button0, file$f, 67, 90, 1375);
    			attr_dev(a0, "class", "documentacion svelte-1tgvj59");
    			attr_dev(a0, "href", "https://rapidapi.com/tipsters/api/sportscore1");
    			add_location(a0, file$f, 67, 12, 1297);
    			attr_dev(h20, "class", "svelte-1tgvj59");
    			add_location(h20, file$f, 65, 8, 1233);
    			add_location(br0, file$f, 69, 8, 1470);
    			attr_dev(p0, "class", "svelte-1tgvj59");
    			add_location(p0, file$f, 70, 4, 1479);
    			attr_dev(div0, "class", "container svelte-1tgvj59");
    			add_location(div0, file$f, 64, 4, 1201);
    			add_location(br1, file$f, 72, 0, 1772);
    			attr_dev(h21, "class", "card-title svelte-1tgvj59");
    			add_location(h21, file$f, 75, 12, 1850);
    			attr_dev(img0, "class", "card-image svelte-1tgvj59");
    			if (!src_url_equal(img0.src, img0_src_value = "https://opencourt.ca/wordpress/wp-content/uploads/2022/06/Canadian-rankings-800x615.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Imagen de Clips");
    			add_location(img0, file$f, 76, 12, 1900);
    			attr_dev(p1, "class", "card-content svelte-1tgvj59");
    			add_location(p1, file$f, 77, 12, 2053);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary");
    			add_location(button1, file$f, 78, 70, 2460);
    			attr_dev(a1, "href", "http://antoniosaborido.es:8081/#/tennisFem/list");
    			add_location(a1, file$f, 78, 12, 2402);
    			attr_dev(div1, "class", "card svelte-1tgvj59");
    			add_location(div1, file$f, 74, 8, 1819);
    			attr_dev(h22, "class", "card-title svelte-1tgvj59");
    			add_location(h22, file$f, 82, 12, 2582);
    			attr_dev(img1, "class", "card-image svelte-1tgvj59");
    			if (!src_url_equal(img1.src, img1_src_value = "https://cdn.statcdn.com/Statistic/805000/807652-blank-355.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "TennisAPI Image");
    			add_location(img1, file$f, 83, 12, 2643);
    			attr_dev(p2, "class", "card-content svelte-1tgvj59");
    			add_location(p2, file$f, 84, 12, 2770);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-primary");
    			add_location(button2, file$f, 85, 71, 3024);
    			attr_dev(a2, "href", "http://antoniosaborido.es:8081/#/tennisFem/chart");
    			add_location(a2, file$f, 85, 12, 2965);
    			attr_dev(div2, "class", "card svelte-1tgvj59");
    			add_location(div2, file$f, 81, 8, 2551);
    			attr_dev(div3, "class", "cards-container svelte-1tgvj59");
    			add_location(div3, file$f, 73, 4, 1781);
    			attr_dev(main, "class", "svelte-1tgvj59");
    			add_location(main, file$f, 63, 0, 1190);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h20);
    			append_dev(h20, t0);
    			append_dev(h20, a0);
    			append_dev(a0, button0);
    			append_dev(div0, t2);
    			append_dev(div0, br0);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(main, t5);
    			append_dev(main, br1);
    			append_dev(main, t6);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t8);
    			append_dev(div1, img0);
    			append_dev(div1, t9);
    			append_dev(div1, p1);
    			append_dev(div1, t11);
    			append_dev(div1, a1);
    			append_dev(a1, button1);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, h22);
    			append_dev(div2, t15);
    			append_dev(div2, img1);
    			append_dev(div2, t16);
    			append_dev(div2, p2);
    			append_dev(div2, t18);
    			append_dev(div2, a2);
    			append_dev(a2, button2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopHub', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopHub> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class TopHub extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopHub",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/tennisFem/topList.svelte generated by Svelte v3.59.2 */

    const { console: console_1$7 } = globals;
    const file$e = "src/tennisFem/topList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (36:4) <Button outline color="btn btn-outline-primary" href="/#/tennisFem"      >
    function create_default_slot_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(36:4) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/tennisFem\\\"      >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (42:1) {:then entries}
    function create_then_block$1(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 129) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(42:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (61:3) {#each entries as entry}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[4].ranking + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[4].team.name + "";
    	let t2;
    	let t3;
    	let td2;
    	let img;
    	let img_src_value;
    	let t4;
    	let td3;
    	let t5_value = /*entry*/ ctx[4].team.country + "";
    	let t5;
    	let t6;
    	let td4;
    	let t7_value = /*entry*/ ctx[4].points + "";
    	let t7;
    	let t8;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			img = element("img");
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td4 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			add_location(td0, file$e, 62, 5, 1262);
    			add_location(td1, file$e, 63, 5, 1292);
    			if (!src_url_equal(img.src, img_src_value = /*entry*/ ctx[4].team.logo)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "WTA");
    			attr_dev(img, "width", "100");
    			attr_dev(img, "height", "100");
    			add_location(img, file$e, 64, 24, 1343);
    			add_location(td2, file$e, 64, 20, 1339);
    			add_location(td3, file$e, 65, 5, 1418);
    			add_location(td4, file$e, 66, 5, 1453);
    			add_location(tr, file$e, 61, 4, 1252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, img);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, t7);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[4].ranking + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[4].team.name + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(img.src, img_src_value = /*entry*/ ctx[4].team.logo)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*entries*/ 1 && t5_value !== (t5_value = /*entry*/ ctx[4].team.country + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*entries*/ 1 && t7_value !== (t7_value = /*entry*/ ctx[4].points + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(61:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (43:1) <Table bordered>
    function create_default_slot$7(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let t10;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Ranking";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Nombre";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Foto";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "País";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Puntos";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$e, 48, 4, 1044);
    			add_location(th1, file$e, 49, 4, 1065);
    			add_location(th2, file$e, 50, 4, 1085);
    			add_location(th3, file$e, 51, 4, 1103);
    			add_location(th4, file$e, 53, 4, 1138);
    			add_location(tr0, file$e, 46, 3, 1030);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$e, 45, 2, 1004);
    			add_location(tr1, file$e, 58, 3, 1204);
    			add_location(tbody, file$e, 57, 2, 1193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(43:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (40:16)  loading  {:then entries}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(40:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let br;
    	let t2;
    	let div;
    	let button;
    	let t3;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/tennisFem",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Clasifición Femenina";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$e, 29, 4, 721);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$e, 28, 2, 685);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$e, 27, 1, 654);
    			add_location(br, file$e, 33, 3, 786);
    			attr_dev(div, "class", "button-container svelte-1etgyx3");
    			add_location(div, file$e, 34, 3, 796);
    			add_location(main, file$e, 25, 0, 645);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, br);
    			append_dev(main, t2);
    			append_dev(main, div);
    			mount_component(button, div, null);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopList', slots, []);
    	let entries = [];
    	onMount(getEntries);
    	const BASEUrl = getBASEUrl();
    	var BASE_API_PATH = `${BASEUrl}/api/v1/tennisWomen`;

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch(BASE_API_PATH);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<TopList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getBASEUrl,
    		BASEUrl,
    		BASE_API_PATH,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class TopList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopList",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/tennisFem/topChart.svelte generated by Svelte v3.59.2 */

    const { console: console_1$6 } = globals;
    const file$d = "src/tennisFem/topChart.svelte";

    // (108:8) <Button outline color="btn btn-outline-primary" href="/#/tennisFem"             >
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(108:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/tennisFem\\\"             >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let div0;
    	let button;
    	let t2;
    	let figure;
    	let div1;
    	let current;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/tennisFem",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			div0 = element("div");
    			create_component(button.$$.fragment);
    			t2 = space();
    			figure = element("figure");
    			div1 = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$d, 96, 4, 2863);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$d, 97, 4, 2933);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$d, 98, 4, 3013);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$d, 99, 4, 3090);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$d, 100, 4, 3169);
    			add_location(br, file$d, 105, 4, 3274);
    			attr_dev(div0, "class", "button-container svelte-1lfj32l");
    			add_location(div0, file$d, 106, 4, 3285);
    			attr_dev(div1, "id", "container");
    			add_location(div1, file$d, 113, 8, 3489);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$d, 112, 4, 3446);
    			add_location(main, file$d, 103, 0, 3262);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			mount_component(button, div0, null);
    			append_dev(main, t2);
    			append_dev(main, figure);
    			append_dev(figure, div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopChart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_teamname = [];
    	let stats_points = [];
    	const BASEUrl = getBASEUrl();
    	var BASE_API_PATH = `${BASEUrl}/api/v1/tennisWomen`;

    	async function getTennisWomen() {
    		console.log("Fetching stats....");
    		const res = await fetch(BASE_API_PATH);

    		if (res.ok) {
    			const data = await res.json();
    			stats = data;
    			console.log("Estadísticas recibidas: " + stats.length);

    			//inicializamos los arrays para mostrar los datos
    			stats.forEach(stat => {
    				stats_teamname.push(stat.team["name"]);
    				stats_points.push(stat["points"]);
    			});

    			//esperamos para que se carrguen los datos
    			await delay(500);

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "spline" },
    			title: { text: "Ranking Tennis Femenino" },
    			subtitle: { text: "API Integrada 5 | Tipo: Spline" },
    			yAxis: { title: { text: "Valor" } },
    			xAxis: {
    				title: { text: "Tenista" },
    				categories: stats_teamname.slice(0, 10)
    			},
    			plotOptions: {
    				pie: {
    					allowPointSelect: true,
    					cursor: 'pointer'
    				}
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				{
    					name: "Puntos",
    					data: stats_points.slice(0, 10)
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getTennisWomen);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<TopChart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		stats,
    		stats_teamname,
    		stats_points,
    		getBASEUrl,
    		BASEUrl,
    		Button,
    		BASE_API_PATH,
    		getTennisWomen,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_teamname' in $$props) stats_teamname = $$props.stats_teamname;
    		if ('stats_points' in $$props) stats_points = $$props.stats_points;
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class TopChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopChart",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/Info.svelte generated by Svelte v3.59.2 */

    const file$c = "src/Info.svelte";

    function create_fragment$c(ctx) {
    	let main;
    	let br0;
    	let t0;
    	let div7;
    	let div0;
    	let t1;
    	let div3;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div1;
    	let h40;
    	let b0;
    	let t4;
    	let a0;
    	let button0;
    	let t6;
    	let div6;
    	let div5;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let div4;
    	let h41;
    	let b1;
    	let t9;
    	let a1;
    	let button1;
    	let t11;
    	let br1;
    	let t12;
    	let div13;
    	let div8;
    	let t13;
    	let div11;
    	let div10;
    	let img2;
    	let img2_src_value;
    	let t14;
    	let div9;
    	let h42;
    	let b2;
    	let t16;
    	let p0;
    	let t18;
    	let a2;
    	let button2;
    	let t20;
    	let a3;
    	let button3;
    	let t22;
    	let a4;
    	let button4;
    	let t24;
    	let a5;
    	let button5;
    	let t26;
    	let a6;
    	let button6;
    	let t28;
    	let a7;
    	let button7;
    	let t30;
    	let a8;
    	let button8;
    	let t32;
    	let div12;
    	let t33;
    	let br2;
    	let t34;
    	let div19;
    	let div14;
    	let t35;
    	let div17;
    	let div16;
    	let div15;
    	let h43;
    	let b3;
    	let t37;
    	let p1;
    	let t39;
    	let div18;

    	const block = {
    		c: function create() {
    			main = element("main");
    			br0 = element("br");
    			t0 = space();
    			div7 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div1 = element("div");
    			h40 = element("h4");
    			b0 = element("b");
    			b0.textContent = "Repositorio de github";
    			t4 = space();
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "Enlace";
    			t6 = space();
    			div6 = element("div");
    			div5 = element("div");
    			img1 = element("img");
    			t7 = space();
    			div4 = element("div");
    			h41 = element("h4");
    			b1 = element("b");
    			b1.textContent = "Gráfica Grupal";
    			t9 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Enlace";
    			t11 = space();
    			br1 = element("br");
    			t12 = space();
    			div13 = element("div");
    			div8 = element("div");
    			t13 = space();
    			div11 = element("div");
    			div10 = element("div");
    			img2 = element("img");
    			t14 = space();
    			div9 = element("div");
    			h42 = element("h4");
    			b2 = element("b");
    			b2.textContent = "Tennis";
    			t16 = space();
    			p0 = element("p");
    			p0.textContent = "Antonio Saborido Campos";
    			t18 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "API V1";
    			t20 = space();
    			a3 = element("a");
    			button3 = element("button");
    			button3.textContent = "API V1 Docs";
    			t22 = space();
    			a4 = element("a");
    			button4 = element("button");
    			button4.textContent = "API V2";
    			t24 = space();
    			a5 = element("a");
    			button5 = element("button");
    			button5.textContent = "API V2 Docs";
    			t26 = space();
    			a6 = element("a");
    			button6 = element("button");
    			button6.textContent = "Interfaz";
    			t28 = space();
    			a7 = element("a");
    			button7 = element("button");
    			button7.textContent = "Gráfica 1";
    			t30 = space();
    			a8 = element("a");
    			button8 = element("button");
    			button8.textContent = "Gráfica 2";
    			t32 = space();
    			div12 = element("div");
    			t33 = space();
    			br2 = element("br");
    			t34 = space();
    			div19 = element("div");
    			div14 = element("div");
    			t35 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			h43 = element("h4");
    			b3 = element("b");
    			b3.textContent = "Antonio Saborido Campos";
    			t37 = space();
    			p1 = element("p");
    			p1.textContent = "Fuente de datos: Tennis";
    			t39 = space();
    			div18 = element("div");
    			add_location(br0, file$c, 1, 4, 11);
    			attr_dev(div0, "class", "col-sm-2");
    			add_location(div0, file$c, 4, 8, 55);
    			if (!src_url_equal(img0.src, img0_src_value = "https://logos-world.net/wp-content/uploads/2020/11/GitHub-Emblem.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Avatar");
    			set_style(img0, "width", "100%");
    			add_location(img0, file$c, 9, 16, 172);
    			add_location(b0, file$c, 15, 24, 427);
    			add_location(h40, file$c, 15, 20, 423);
    			attr_dev(button0, "class", "btn btn-primary");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$c, 17, 24, 554);
    			attr_dev(a0, "href", "https://github.com/gti-sos/SOS2122-23");
    			add_location(a0, file$c, 16, 20, 481);
    			attr_dev(div1, "class", "container svelte-110ltv7");
    			add_location(div1, file$c, 14, 16, 379);
    			attr_dev(div2, "class", "card svelte-110ltv7");
    			add_location(div2, file$c, 8, 12, 137);
    			attr_dev(div3, "class", "col-sm-4");
    			add_location(div3, file$c, 7, 8, 102);
    			if (!src_url_equal(img1.src, img1_src_value = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx7LjsiVGVT5pTCSj0ANMAoaJ0ELqh5hmygZv2q3YeM2VQLkm8FGeA8Cr_DeZQI_4o1Ps&usqp=CAU")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Avatar");
    			set_style(img1, "width", "100%");
    			add_location(img1, file$c, 27, 16, 847);
    			add_location(b1, file$c, 33, 24, 1166);
    			add_location(h41, file$c, 33, 20, 1162);
    			attr_dev(button1, "class", "btn btn-primary");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$c, 35, 24, 1262);
    			attr_dev(a1, "href", "/#/groupgraph");
    			add_location(a1, file$c, 34, 20, 1213);
    			attr_dev(div4, "class", "container svelte-110ltv7");
    			add_location(div4, file$c, 32, 16, 1118);
    			attr_dev(div5, "class", "card svelte-110ltv7");
    			add_location(div5, file$c, 26, 12, 812);
    			attr_dev(div6, "class", "col-sm-4");
    			add_location(div6, file$c, 25, 8, 777);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file$c, 2, 4, 20);
    			add_location(br1, file$c, 44, 4, 1495);
    			attr_dev(div8, "class", "col-sm-4");
    			add_location(div8, file$c, 46, 8, 1530);
    			if (!src_url_equal(img2.src, img2_src_value = "https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Avatar");
    			set_style(img2, "width", "100%");
    			add_location(img2, file$c, 52, 16, 1660);
    			add_location(b2, file$c, 58, 24, 2003);
    			add_location(h42, file$c, 58, 20, 1999);
    			add_location(p0, file$c, 59, 20, 2042);
    			attr_dev(button2, "class", "btn btn-primary");
    			attr_dev(button2, "type", "submit");
    			add_location(button2, file$c, 61, 24, 2143);
    			attr_dev(a2, "href", "/api/v1/tennis");
    			add_location(a2, file$c, 60, 20, 2093);
    			attr_dev(button3, "class", "btn btn-primary");
    			attr_dev(button3, "type", "submit");
    			add_location(button3, file$c, 66, 24, 2359);
    			attr_dev(a3, "href", "/api/v1/tennis/docs");
    			add_location(a3, file$c, 65, 20, 2304);
    			attr_dev(button4, "class", "btn btn-primary");
    			attr_dev(button4, "type", "submit");
    			add_location(button4, file$c, 71, 24, 2575);
    			attr_dev(a4, "href", "/api/v2/tennis");
    			add_location(a4, file$c, 70, 20, 2525);
    			attr_dev(button5, "class", "btn btn-primary");
    			attr_dev(button5, "type", "submit");
    			add_location(button5, file$c, 76, 24, 2791);
    			attr_dev(a5, "href", "/api/v2/tennis/docs");
    			add_location(a5, file$c, 75, 20, 2736);
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "type", "submit");
    			add_location(button6, file$c, 81, 24, 3002);
    			attr_dev(a6, "href", "/#/tennis");
    			add_location(a6, file$c, 80, 20, 2957);
    			attr_dev(button7, "class", "btn btn-primary");
    			attr_dev(button7, "type", "submit");
    			add_location(button7, file$c, 86, 24, 3216);
    			attr_dev(a7, "href", "/#/tennis/chart");
    			add_location(a7, file$c, 85, 20, 3165);
    			attr_dev(button8, "class", "btn btn-primary");
    			attr_dev(button8, "type", "submit");
    			add_location(button8, file$c, 91, 24, 3432);
    			attr_dev(a8, "href", "/#/tennis/chart2");
    			add_location(a8, file$c, 90, 20, 3380);
    			attr_dev(div9, "class", "container svelte-110ltv7");
    			add_location(div9, file$c, 57, 16, 1955);
    			attr_dev(div10, "class", "card svelte-110ltv7");
    			add_location(div10, file$c, 51, 12, 1625);
    			attr_dev(div11, "class", "col-sm-4");
    			add_location(div11, file$c, 50, 8, 1590);
    			attr_dev(div12, "class", "col-sm-4");
    			add_location(div12, file$c, 98, 8, 3641);
    			attr_dev(div13, "class", "row");
    			add_location(div13, file$c, 45, 4, 1504);
    			add_location(br2, file$c, 102, 4, 3707);
    			attr_dev(div14, "class", "col-sm-4");
    			add_location(div14, file$c, 104, 8, 3742);
    			add_location(b3, file$c, 111, 24, 3920);
    			add_location(h43, file$c, 111, 20, 3916);
    			add_location(p1, file$c, 112, 20, 3976);
    			attr_dev(div15, "class", "container svelte-110ltv7");
    			add_location(div15, file$c, 110, 16, 3872);
    			attr_dev(div16, "class", "card svelte-110ltv7");
    			add_location(div16, file$c, 109, 12, 3837);
    			attr_dev(div17, "class", "col-sm-4");
    			add_location(div17, file$c, 108, 8, 3802);
    			attr_dev(div18, "class", "col-sm-4");
    			add_location(div18, file$c, 119, 8, 4115);
    			attr_dev(div19, "class", "row");
    			add_location(div19, file$c, 103, 4, 3716);
    			add_location(main, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, br0);
    			append_dev(main, t0);
    			append_dev(main, div7);
    			append_dev(div7, div0);
    			append_dev(div7, t1);
    			append_dev(div7, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, h40);
    			append_dev(h40, b0);
    			append_dev(div1, t4);
    			append_dev(div1, a0);
    			append_dev(a0, button0);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, img1);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, h41);
    			append_dev(h41, b1);
    			append_dev(div4, t9);
    			append_dev(div4, a1);
    			append_dev(a1, button1);
    			append_dev(main, t11);
    			append_dev(main, br1);
    			append_dev(main, t12);
    			append_dev(main, div13);
    			append_dev(div13, div8);
    			append_dev(div13, t13);
    			append_dev(div13, div11);
    			append_dev(div11, div10);
    			append_dev(div10, img2);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(div9, h42);
    			append_dev(h42, b2);
    			append_dev(div9, t16);
    			append_dev(div9, p0);
    			append_dev(div9, t18);
    			append_dev(div9, a2);
    			append_dev(a2, button2);
    			append_dev(div9, t20);
    			append_dev(div9, a3);
    			append_dev(a3, button3);
    			append_dev(div9, t22);
    			append_dev(div9, a4);
    			append_dev(a4, button4);
    			append_dev(div9, t24);
    			append_dev(div9, a5);
    			append_dev(a5, button5);
    			append_dev(div9, t26);
    			append_dev(div9, a6);
    			append_dev(a6, button6);
    			append_dev(div9, t28);
    			append_dev(div9, a7);
    			append_dev(a7, button7);
    			append_dev(div9, t30);
    			append_dev(div9, a8);
    			append_dev(a8, button8);
    			append_dev(div13, t32);
    			append_dev(div13, div12);
    			append_dev(main, t33);
    			append_dev(main, br2);
    			append_dev(main, t34);
    			append_dev(main, div19);
    			append_dev(div19, div14);
    			append_dev(div19, t35);
    			append_dev(div19, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, h43);
    			append_dev(h43, b3);
    			append_dev(div15, t37);
    			append_dev(div15, p1);
    			append_dev(div19, t39);
    			append_dev(div19, div18);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.59.2 */

    const file$b = "src/components/Footer.svelte";

    function create_fragment$b(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "https://github.com/Antoniiosc7/TFG-Svelte";
    			attr_dev(div, "class", "copyright svelte-p8u2kc");
    			add_location(div, file$b, 1, 4, 13);
    			attr_dev(footer, "class", "svelte-p8u2kc");
    			add_location(footer, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.59.2 */
    const file$a = "src/components/Header.svelte";

    function create_fragment$a(ctx) {
    	let header;
    	let nav;
    	let div3;
    	let a0;
    	let t1;
    	let button;
    	let span;
    	let t2;
    	let div2;
    	let ul;
    	let li0;
    	let a1;
    	let t4;
    	let li1;
    	let a2;
    	let t6;
    	let li2;
    	let a3;
    	let t8;
    	let li3;
    	let a4;
    	let t10;
    	let li4;
    	let a5;
    	let t12;
    	let li5;
    	let div0;
    	let t14;
    	let li6;
    	let a6;
    	let t16;
    	let div1;
    	let a7;
    	let t18;
    	let a8;
    	let div1_class_value;
    	let t20;
    	let li7;
    	let a9;
    	let div2_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav = element("nav");
    			div3 = element("div");
    			a0 = element("a");
    			a0.textContent = "INICIO";
    			t1 = space();
    			button = element("button");
    			span = element("span");
    			t2 = space();
    			div2 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Info";
    			t4 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Twitch";
    			t6 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Top Tennis FEM";
    			t8 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Live Tennis Ranking";
    			t10 = space();
    			li4 = element("li");
    			a5 = element("a");
    			a5.textContent = "Productos";
    			t12 = space();
    			li5 = element("li");
    			div0 = element("div");
    			div0.textContent = "|";
    			t14 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Front-Ends";
    			t16 = space();
    			div1 = element("div");
    			a7 = element("a");
    			a7.textContent = "Tennis";
    			t18 = space();
    			a8 = element("a");
    			a8.textContent = "Premier-League";
    			t20 = space();
    			li7 = element("li");
    			a9 = element("a");
    			a9.textContent = "Visualizaciones";
    			attr_dev(a0, "class", "navbar-brand svelte-biyw6v");
    			attr_dev(a0, "href", "http://tfg.antoniosaborido.es");
    			add_location(a0, file$a, 20, 12, 508);
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$a, 22, 16, 680);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			add_location(button, file$a, 21, 12, 592);
    			attr_dev(a1, "class", "nav-link svelte-biyw6v");
    			attr_dev(a1, "href", "/#/");
    			set_style(a1, "color", "white");
    			add_location(a1, file$a, 27, 24, 979);
    			attr_dev(li0, "class", "nav-item svelte-biyw6v");
    			add_location(li0, file$a, 26, 20, 933);
    			attr_dev(a2, "class", "nav-link svelte-biyw6v");
    			attr_dev(a2, "href", "/#/TwitchHub");
    			set_style(a2, "color", "white");
    			add_location(a2, file$a, 30, 24, 1133);
    			attr_dev(li1, "class", "nav-item svelte-biyw6v");
    			add_location(li1, file$a, 29, 20, 1087);
    			attr_dev(a3, "class", "nav-link svelte-biyw6v");
    			attr_dev(a3, "href", "/#/tennisFem");
    			set_style(a3, "color", "white");
    			add_location(a3, file$a, 33, 24, 1298);
    			attr_dev(li2, "class", "nav-item svelte-biyw6v");
    			add_location(li2, file$a, 32, 20, 1252);
    			attr_dev(a4, "class", "nav-link svelte-biyw6v");
    			attr_dev(a4, "href", "/#/topTennis");
    			set_style(a4, "color", "white");
    			add_location(a4, file$a, 36, 24, 1471);
    			attr_dev(li3, "class", "nav-item svelte-biyw6v");
    			add_location(li3, file$a, 35, 20, 1425);
    			attr_dev(a5, "class", "nav-link svelte-biyw6v");
    			attr_dev(a5, "href", "/#/Productos");
    			set_style(a5, "color", "white");
    			add_location(a5, file$a, 39, 24, 1649);
    			attr_dev(li4, "class", "nav-item svelte-biyw6v");
    			add_location(li4, file$a, 38, 20, 1603);
    			attr_dev(div0, "class", "nav-link");
    			add_location(div0, file$a, 42, 24, 1817);
    			attr_dev(li5, "class", "nav-item svelte-biyw6v");
    			add_location(li5, file$a, 41, 20, 1771);
    			attr_dev(a6, "class", "nav-link dropdown-toggle svelte-biyw6v");
    			set_style(a6, "color", "white");
    			attr_dev(a6, "id", "dropdownMenuButton");
    			attr_dev(a6, "data-toggle", "dropdown");
    			attr_dev(a6, "tabindex", "0");
    			add_location(a6, file$a, 45, 24, 1948);
    			attr_dev(a7, "class", "dropdown-item svelte-biyw6v");
    			attr_dev(a7, "href", "/#/Tennis");
    			set_style(a7, "color", "#2980b9");
    			add_location(a7, file$a, 49, 28, 2345);
    			attr_dev(a8, "class", "dropdown-item svelte-biyw6v");
    			attr_dev(a8, "href", "/#/Premier-League");
    			set_style(a8, "color", "#2980b9");
    			add_location(a8, file$a, 50, 28, 2450);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty("dropdown-menu " + (/*isDropdownOpen*/ ctx[0] ? 'show' : '')) + " svelte-biyw6v"));
    			attr_dev(div1, "aria-labelledby", "dropdownMenuButton");
    			add_location(div1, file$a, 48, 24, 2216);
    			attr_dev(li6, "class", "nav-item dropdown svelte-biyw6v");
    			add_location(li6, file$a, 44, 20, 1893);
    			attr_dev(a9, "class", "nav-link svelte-biyw6v");
    			attr_dev(a9, "href", "/#/Visualizaciones");
    			set_style(a9, "color", "white");
    			add_location(a9, file$a, 55, 24, 2691);
    			attr_dev(li7, "class", "nav-item svelte-biyw6v");
    			add_location(li7, file$a, 54, 20, 2645);
    			attr_dev(ul, "class", "navbar-nav ml-auto");
    			add_location(ul, file$a, 25, 16, 881);
    			attr_dev(div2, "class", "collapse navbar-collapse");

    			attr_dev(div2, "style", div2_style_value = {
    				.../*isDropdownOpen*/ ctx[0]
    				? 'display: block;'
    				: 'display: none; '
    			});

    			add_location(div2, file$a, 24, 12, 756);
    			attr_dev(div3, "class", "container svelte-biyw6v");
    			add_location(div3, file$a, 19, 8, 472);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-dark");
    			set_style(nav, "background-color", "#3498db");
    			add_location(nav, file$a, 18, 4, 379);
    			attr_dev(header, "class", "svelte-biyw6v");
    			add_location(header, file$a, 17, 0, 366);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, div3);
    			append_dev(div3, a0);
    			append_dev(div3, t1);
    			append_dev(div3, button);
    			append_dev(button, span);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(ul, t10);
    			append_dev(ul, li4);
    			append_dev(li4, a5);
    			append_dev(ul, t12);
    			append_dev(ul, li5);
    			append_dev(li5, div0);
    			append_dev(ul, t14);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			append_dev(li6, t16);
    			append_dev(li6, div1);
    			append_dev(div1, a7);
    			append_dev(div1, t18);
    			append_dev(div1, a8);
    			append_dev(ul, t20);
    			append_dev(ul, li7);
    			append_dev(li7, a9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*toggleDropdown*/ ctx[1], false, false, false, false),
    					listen_dev(a6, "click", /*toggleDropdown*/ ctx[1], false, false, false, false),
    					listen_dev(a6, "keydown", /*handleDropdownKey*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isDropdownOpen*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty("dropdown-menu " + (/*isDropdownOpen*/ ctx[0] ? 'show' : '')) + " svelte-biyw6v"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*isDropdownOpen*/ 1 && div2_style_value !== (div2_style_value = {
    				.../*isDropdownOpen*/ ctx[0]
    				? 'display: block;'
    				: 'display: none; '
    			})) {
    				attr_dev(div2, "style", div2_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let isDropdownOpen = false;

    	function toggleDropdown() {
    		$$invalidate(0, isDropdownOpen = !isDropdownOpen);
    	}

    	function handleDropdownKey(event) {
    		if (event.key === "Enter" || event.key === " ") {
    			event.preventDefault();
    			toggleDropdown();
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		isDropdownOpen,
    		toggleDropdown,
    		handleDropdownKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('isDropdownOpen' in $$props) $$invalidate(0, isDropdownOpen = $$props.isDropdownOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isDropdownOpen, toggleDropdown, handleDropdownKey];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Grupal1.svelte generated by Svelte v3.59.2 */

    const { console: console_1$5 } = globals;
    const file$9 = "src/Grupal1.svelte";

    // (300:4) <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"         >
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(300:4) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Visualizaciones\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (303:4) <Button outline color="success" on:click={cargarDatosIniciales}         >
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos iniciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(303:4) <Button outline color=\\\"success\\\" on:click={cargarDatosIniciales}         >",
    		ctx
    	});

    	return block;
    }

    // (306:4) <Button outline color="danger" on:click={BorrarEntries}>
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(306:4) <Button outline color=\\\"danger\\\" on:click={BorrarEntries}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let figure;
    	let div;
    	let t5;
    	let p;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Visualizaciones",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*cargarDatosIniciales*/ ctx[0]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*BorrarEntries*/ ctx[1]);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			create_component(button2.$$.fragment);
    			t4 = space();
    			figure = element("figure");
    			div = element("div");
    			t5 = space();
    			p = element("p");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$9, 290, 4, 10686);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$9, 291, 4, 10756);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$9, 292, 4, 10836);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$9, 293, 4, 10913);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$9, 294, 4, 10992);
    			add_location(br, file$9, 298, 4, 11096);
    			attr_dev(div, "id", "container");
    			add_location(div, file$9, 307, 8, 11453);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$9, 308, 8, 11484);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$9, 306, 4, 11410);
    			add_location(main, file$9, 297, 0, 11085);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			mount_component(button0, main, null);
    			append_dev(main, t2);
    			mount_component(button1, main, null);
    			append_dev(main, t3);
    			mount_component(button2, main, null);
    			append_dev(main, t4);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t5);
    			append_dev(figure, p);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grupal1', slots, []);
    	const BASEUrl = getBASEUrl();
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let xLabel = [];

    	//TENNIS
    	let TennisStats = [];

    	let stats_mostgrandslams = [];
    	let stats_mastersfinals = [];
    	let stats_olympicgoldmedals = [];

    	//PREMIER
    	let PremierStats = [];

    	let appearences_stats = [];
    	let goals_stats = [];
    	let cleansheets_stats = [];

    	//NBA STATS
    	let NBAStats = [];

    	let mostpoints_stats = [];
    	let fieldgoals_stats = [];
    	let efficiency_stats = [];

    	async function cargarDatosIniciales() {
    		const nba3 = await fetch(`${BASEUrl}/api/v2/nba-stats/loadInitialData`);
    		const premier3 = await fetch(`${BASEUrl}/api/v2/premier-league/loadInitialData`);
    		const tennis3 = await fetch(`${BASEUrl}/api/v2/tennis/loadInitialData`);
    		const nba2 = await fetch(`${BASEUrl}/api/v2/nba-stats`);
    		const premier2 = await fetch(`${BASEUrl}/api/v2/premier-league`);
    		const tennis2 = await fetch(`${BASEUrl}/api/v2/tennis`);

    		if (nba3.ok && premier3.ok && tennis3.ok) {
    			if (nba2.ok && premier2.ok && tennis2.ok) {
    				NBAStats = await nba2.json();
    				TennisStats = await tennis2.json();
    				PremierStats = await premier2.json();

    				//Nba
    				NBAStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    				NBAStats.sort((a, b) => a.country > b.country
    				? 1
    				: b.country > a.country ? -1 : 0);

    				NBAStats.forEach(element => {
    					mostpoints_stats.push(parseFloat(element.mostpoints));
    					fieldgoals_stats.push(parseFloat(element.fieldgoals));
    					efficiency_stats.push(parseFloat(element.efficiency));
    				});

    				//Tennis
    				TennisStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    				TennisStats.sort((a, b) => a.country > b.country
    				? 1
    				: b.country > a.country ? -1 : 0);

    				TennisStats.forEach(element => {
    					stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
    					stats_mastersfinals.push(parseFloat(element.masters_finals));
    					stats_olympicgoldmedals.push(parseFloat(element.olympic_gold_medals));
    				});

    				//Premier
    				PremierStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    				PremierStats.sort((a, b) => a.country > b.country
    				? 1
    				: b.country > a.country ? -1 : 0);

    				PremierStats.forEach(element => {
    					appearences_stats.push(parseFloat(element.appearences));
    					cleansheets_stats.push(parseFloat(element.cleanSheets));
    					goals_stats.push(parseFloat(element.goals));
    				});

    				NBAStats.forEach(element => {
    					xLabel.push(element.country + "," + parseInt(element.year));
    				});

    				TennisStats.forEach(element => {
    					xLabel.push(element.country + "," + parseInt(element.year));
    				});

    				PremierStats.forEach(element => {
    					xLabel.push(element.country + "," + parseInt(element.year));
    				});

    				xLabel = new Set(xLabel);
    				xLabel = Array.from(xLabel);
    				xLabel.sort();
    				await delay(500);
    				loadGraph();
    			}
    		}
    	}

    	async function getData() {
    		const nba2 = await fetch(`${BASEUrl}/api/v2/nba-stats`);
    		const premier2 = await fetch(`${BASEUrl}/api/v2/premier-league`);
    		const tennis2 = await fetch(`${BASEUrl}/api/v2/tennis`);

    		if (nba2.ok && premier2.ok && tennis2.ok) {
    			NBAStats = await nba2.json();
    			TennisStats = await tennis2.json();
    			PremierStats = await premier2.json();

    			//Nba
    			NBAStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    			NBAStats.sort((a, b) => a.country > b.country
    			? 1
    			: b.country > a.country ? -1 : 0);

    			NBAStats.forEach(element => {
    				mostpoints_stats.push(parseFloat(element.mostpoints));
    				fieldgoals_stats.push(parseFloat(element.fieldgoals));
    				efficiency_stats.push(parseFloat(element.efficiency));
    			});

    			//Tennis
    			TennisStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    			TennisStats.sort((a, b) => a.country > b.country
    			? 1
    			: b.country > a.country ? -1 : 0);

    			TennisStats.forEach(element => {
    				stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
    				stats_mastersfinals.push(parseFloat(element.masters_finals));
    				stats_olympicgoldmedals.push(parseFloat(element.olympic_gold_medals));
    			});

    			//Premier
    			PremierStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    			PremierStats.sort((a, b) => a.country > b.country
    			? 1
    			: b.country > a.country ? -1 : 0);

    			PremierStats.forEach(element => {
    				appearences_stats.push(parseFloat(element.appearences));
    				cleansheets_stats.push(parseFloat(element.cleanSheets));
    				goals_stats.push(parseFloat(element.goals));
    			});

    			NBAStats.forEach(element => {
    				xLabel.push(element.country + "," + parseInt(element.year));
    			});

    			TennisStats.forEach(element => {
    				xLabel.push(element.country + "," + parseInt(element.year));
    			});

    			PremierStats.forEach(element => {
    				xLabel.push(element.country + "," + parseInt(element.year));
    			});

    			xLabel = new Set(xLabel);
    			xLabel = Array.from(xLabel);
    			xLabel.sort();
    			await delay(500);
    			loadGraph();
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "area" },
    			title: { text: "Gráficas conjuntas" },
    			subtitle: {
    				text: "APIs: NBA, Premier-League & Tennis | Tipo: Line"
    			},
    			yAxis: { title: { text: "Valor" } },
    			xAxis: {
    				title: { text: "País-Año" },
    				// categories: stats_country_date,
    				categories: xLabel
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				//Tennis
    				{
    					name: "Grand Slams Ganados",
    					data: stats_mostgrandslams
    				},
    				{
    					name: "Medallas Olimpicas",
    					data: stats_olympicgoldmedals
    				},
    				{
    					name: "Finales de masters",
    					data: stats_mastersfinals
    				},
    				//PremierLeauge
    				{
    					name: "Partidos jugados",
    					data: appearences_stats
    				},
    				{ name: "Goles", data: goals_stats },
    				{
    					name: "Porterias a cero",
    					data: cleansheets_stats
    				},
    				//NBA
    				{
    					name: "Más puntos",
    					data: mostpoints_stats
    				},
    				{
    					name: "Tiros de campo",
    					data: fieldgoals_stats
    				},
    				{
    					name: "Eficiencia",
    					data: efficiency_stats
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getData);

    	async function BorrarEntries() {
    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			try {
    				const nbaDeleteResponse = await fetch(`${BASEUrl}/api/v2/nba-stats`, { method: "DELETE" });
    				const premierDeleteResponse = await fetch(`${BASEUrl}/api/v2/premier-league`, { method: "DELETE" });
    				const tennisDeleteResponse = await fetch(`${BASEUrl}/api/v2/tennis`, { method: "DELETE" });

    				if (nbaDeleteResponse.ok && premierDeleteResponse.ok && tennisDeleteResponse.ok) {
    					console.log("Data deleted and graph updated successfully.");
    					window.location.reload();
    					console.error("Error deleting data.");
    				}
    			} catch(error) {
    				console.error("An error occurred:", error);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Grupal1> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getBASEUrl,
    		BASEUrl,
    		onMount,
    		Button,
    		delay,
    		xLabel,
    		TennisStats,
    		stats_mostgrandslams,
    		stats_mastersfinals,
    		stats_olympicgoldmedals,
    		PremierStats,
    		appearences_stats,
    		goals_stats,
    		cleansheets_stats,
    		NBAStats,
    		mostpoints_stats,
    		fieldgoals_stats,
    		efficiency_stats,
    		cargarDatosIniciales,
    		getData,
    		loadGraph,
    		BorrarEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('xLabel' in $$props) xLabel = $$props.xLabel;
    		if ('TennisStats' in $$props) TennisStats = $$props.TennisStats;
    		if ('stats_mostgrandslams' in $$props) stats_mostgrandslams = $$props.stats_mostgrandslams;
    		if ('stats_mastersfinals' in $$props) stats_mastersfinals = $$props.stats_mastersfinals;
    		if ('stats_olympicgoldmedals' in $$props) stats_olympicgoldmedals = $$props.stats_olympicgoldmedals;
    		if ('PremierStats' in $$props) PremierStats = $$props.PremierStats;
    		if ('appearences_stats' in $$props) appearences_stats = $$props.appearences_stats;
    		if ('goals_stats' in $$props) goals_stats = $$props.goals_stats;
    		if ('cleansheets_stats' in $$props) cleansheets_stats = $$props.cleansheets_stats;
    		if ('NBAStats' in $$props) NBAStats = $$props.NBAStats;
    		if ('mostpoints_stats' in $$props) mostpoints_stats = $$props.mostpoints_stats;
    		if ('fieldgoals_stats' in $$props) fieldgoals_stats = $$props.fieldgoals_stats;
    		if ('efficiency_stats' in $$props) efficiency_stats = $$props.efficiency_stats;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cargarDatosIniciales, BorrarEntries];
    }

    class Grupal1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grupal1",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Analytics.svelte generated by Svelte v3.59.2 */
    const file$8 = "src/Analytics.svelte";

    function create_fragment$8(ctx) {
    	let main;
    	let div5;
    	let div0;
    	let h1;
    	let t1;
    	let div4;
    	let div1;
    	let t2;
    	let div2;
    	let h5;
    	let t4;
    	let hr;
    	let t5;
    	let h60;
    	let t7;
    	let ul0;
    	let a0;
    	let li0;
    	let t9;
    	let a1;
    	let li1;
    	let t11;
    	let a2;
    	let li2;
    	let t13;
    	let h61;
    	let t15;
    	let ul1;
    	let a3;
    	let li3;
    	let t17;
    	let a4;
    	let li4;
    	let t19;
    	let a5;
    	let li5;
    	let t21;
    	let h62;
    	let t23;
    	let ul2;
    	let a6;
    	let li6;
    	let t25;
    	let a7;
    	let li7;
    	let t27;
    	let a8;
    	let li8;
    	let t29;
    	let div3;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Integraciones";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Antonio Saborido Campos";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			h60 = element("h6");
    			h60.textContent = "Integración Externa 1 (Twitch API)";
    			t7 = space();
    			ul0 = element("ul");
    			a0 = element("a");
    			li0 = element("li");
    			li0.textContent = "Archivo JSON";
    			t9 = space();
    			a1 = element("a");
    			li1 = element("li");
    			li1.textContent = "Vista tabla con reproductor";
    			t11 = space();
    			a2 = element("a");
    			li2 = element("li");
    			li2.textContent = "Grafica visitas";
    			t13 = space();
    			h61 = element("h6");
    			h61.textContent = "Integración Externa 2 (Ultimate Tennis)";
    			t15 = space();
    			ul1 = element("ul");
    			a3 = element("a");
    			li3 = element("li");
    			li3.textContent = "Archivo JSON";
    			t17 = space();
    			a4 = element("a");
    			li4 = element("li");
    			li4.textContent = "Vista en tabla";
    			t19 = space();
    			a5 = element("a");
    			li5 = element("li");
    			li5.textContent = "Grafica";
    			t21 = space();
    			h62 = element("h6");
    			h62.textContent = "Integración Externa 5 (SportScore: Clasifición tennis feminino)";
    			t23 = space();
    			ul2 = element("ul");
    			a6 = element("a");
    			li6 = element("li");
    			li6.textContent = "Archivo JSON";
    			t25 = space();
    			a7 = element("a");
    			li7 = element("li");
    			li7.textContent = "Vista en tabla";
    			t27 = space();
    			a8 = element("a");
    			li8 = element("li");
    			li8.textContent = "Gráfica";
    			t29 = space();
    			div3 = element("div");
    			add_location(h1, file$8, 8, 12, 171);
    			attr_dev(div0, "id", "titulo");
    			attr_dev(div0, "class", "svelte-1811j4m");
    			add_location(div0, file$8, 7, 8, 141);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$8, 11, 12, 247);
    			attr_dev(h5, "id", "titulo");
    			attr_dev(h5, "class", "svelte-1811j4m");
    			add_location(h5, file$8, 15, 16, 351);
    			add_location(hr, file$8, 16, 16, 412);
    			add_location(h60, file$8, 17, 16, 435);
    			attr_dev(li0, "type", "circle");
    			add_location(li0, file$8, 19, 65, 569);
    			attr_dev(a0, "href", "" + (/*BASEUrl*/ ctx[0] + "/api/v1/tennis-twitch"));
    			add_location(a0, file$8, 19, 24, 528);
    			attr_dev(li1, "type", "circle");
    			add_location(li1, file$8, 20, 51, 661);
    			attr_dev(a1, "href", "/#/tennis/twitch");
    			add_location(a1, file$8, 20, 24, 634);
    			attr_dev(li2, "type", "circle");
    			add_location(li2, file$8, 21, 56, 773);
    			attr_dev(a2, "href", "/#/tennis/twitchchart");
    			add_location(a2, file$8, 21, 24, 741);
    			add_location(ul0, file$8, 18, 20, 499);
    			add_location(h61, file$8, 23, 16, 859);
    			attr_dev(li3, "type", "circle");
    			add_location(li3, file$8, 25, 69, 1002);
    			attr_dev(a3, "href", "" + (/*BASEUrl*/ ctx[0] + "/api/v1/tennisLiveRanking"));
    			add_location(a3, file$8, 25, 24, 957);
    			attr_dev(li4, "type", "circle");
    			add_location(li4, file$8, 26, 58, 1101);
    			attr_dev(a4, "href", "/#/tennis/apitennislist");
    			add_location(a4, file$8, 26, 24, 1067);
    			attr_dev(li5, "type", "circle");
    			add_location(li5, file$8, 27, 59, 1203);
    			attr_dev(a5, "href", "/#/tennis/apitennischart");
    			add_location(a5, file$8, 27, 24, 1168);
    			add_location(ul1, file$8, 24, 20, 928);
    			add_location(h62, file$8, 29, 16, 1281);
    			attr_dev(li6, "type", "circle");
    			add_location(li6, file$8, 31, 63, 1442);
    			attr_dev(a6, "href", "" + (/*BASEUrl*/ ctx[0] + "/api/v1/tennisWomen"));
    			add_location(a6, file$8, 31, 24, 1403);
    			attr_dev(li7, "type", "circle");
    			add_location(li7, file$8, 32, 56, 1539);
    			attr_dev(a7, "href", "/#/tennis/apiext5list");
    			add_location(a7, file$8, 32, 24, 1507);
    			attr_dev(li8, "type", "circle");
    			add_location(li8, file$8, 33, 57, 1639);
    			attr_dev(a8, "href", "/#/tennis/apiext5chart");
    			add_location(a8, file$8, 33, 24, 1606);
    			add_location(ul2, file$8, 30, 20, 1374);
    			attr_dev(div2, "class", "col-4");
    			add_location(div2, file$8, 14, 12, 315);
    			attr_dev(div3, "class", "col-4");
    			add_location(div3, file$8, 36, 12, 1741);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$8, 10, 8, 217);
    			attr_dev(div5, "class", "container svelte-1811j4m");
    			add_location(div5, file$8, 6, 4, 109);
    			add_location(main, file$8, 5, 0, 98);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h1);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, h5);
    			append_dev(div2, t4);
    			append_dev(div2, hr);
    			append_dev(div2, t5);
    			append_dev(div2, h60);
    			append_dev(div2, t7);
    			append_dev(div2, ul0);
    			append_dev(ul0, a0);
    			append_dev(a0, li0);
    			append_dev(ul0, t9);
    			append_dev(ul0, a1);
    			append_dev(a1, li1);
    			append_dev(ul0, t11);
    			append_dev(ul0, a2);
    			append_dev(a2, li2);
    			append_dev(div2, t13);
    			append_dev(div2, h61);
    			append_dev(div2, t15);
    			append_dev(div2, ul1);
    			append_dev(ul1, a3);
    			append_dev(a3, li3);
    			append_dev(ul1, t17);
    			append_dev(ul1, a4);
    			append_dev(a4, li4);
    			append_dev(ul1, t19);
    			append_dev(ul1, a5);
    			append_dev(a5, li5);
    			append_dev(div2, t21);
    			append_dev(div2, h62);
    			append_dev(div2, t23);
    			append_dev(div2, ul2);
    			append_dev(ul2, a6);
    			append_dev(a6, li6);
    			append_dev(ul2, t25);
    			append_dev(ul2, a7);
    			append_dev(a7, li7);
    			append_dev(ul2, t27);
    			append_dev(ul2, a8);
    			append_dev(a8, li8);
    			append_dev(div4, t29);
    			append_dev(div4, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Analytics', slots, []);
    	const BASEUrl = getBASEUrl();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Analytics> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getBASEUrl, BASEUrl });
    	return [BASEUrl];
    }

    class Analytics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Analytics",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/About.svelte generated by Svelte v3.59.2 */

    const file$7 = "src/About.svelte";

    function create_fragment$7(ctx) {
    	let main;
    	let div5;
    	let div0;
    	let h1;
    	let t1;
    	let div4;
    	let div1;
    	let t2;
    	let div2;
    	let h5;
    	let t4;
    	let hr;
    	let t5;
    	let p;
    	let a;
    	let t7;
    	let iframe;
    	let iframe_src_value;
    	let t8;
    	let div3;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Videos";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Antonio Saborido Campos";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			p = element("p");
    			a = element("a");
    			a.textContent = "Enlace";
    			t7 = space();
    			iframe = element("iframe");
    			t8 = space();
    			div3 = element("div");
    			add_location(h1, file$7, 3, 12, 73);
    			attr_dev(div0, "id", "titulo");
    			attr_dev(div0, "class", "svelte-1811j4m");
    			add_location(div0, file$7, 2, 8, 43);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$7, 7, 12, 143);
    			attr_dev(h5, "id", "titulo");
    			attr_dev(h5, "class", "svelte-1811j4m");
    			add_location(h5, file$7, 12, 16, 232);
    			add_location(hr, file$7, 13, 16, 293);
    			attr_dev(a, "href", "https://youtu.be/--DtiB_OiU8");
    			add_location(a, file$7, 14, 19, 319);
    			add_location(p, file$7, 14, 16, 316);
    			attr_dev(iframe, "width", "410");
    			attr_dev(iframe, "height", "210");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube.com/embed/--DtiB_OiU8")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube video player");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$7, 15, 16, 391);
    			attr_dev(div2, "class", "col-4");
    			add_location(div2, file$7, 11, 12, 196);
    			attr_dev(div3, "class", "col-4");
    			add_location(div3, file$7, 19, 12, 685);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$7, 5, 8, 112);
    			attr_dev(div5, "class", "container svelte-1811j4m");
    			add_location(div5, file$7, 1, 4, 11);
    			add_location(main, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h1);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, h5);
    			append_dev(div2, t4);
    			append_dev(div2, hr);
    			append_dev(div2, t5);
    			append_dev(div2, p);
    			append_dev(p, a);
    			append_dev(div2, t7);
    			append_dev(div2, iframe);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Grupal2.svelte generated by Svelte v3.59.2 */

    const { console: console_1$4 } = globals;
    const file$6 = "src/Grupal2.svelte";

    // (300:4) <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"         >
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(300:4) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Visualizaciones\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (303:4) <Button outline color="success" on:click={cargarDatosIniciales}         >
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos iniciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(303:4) <Button outline color=\\\"success\\\" on:click={cargarDatosIniciales}         >",
    		ctx
    	});

    	return block;
    }

    // (306:4) <Button outline color="danger" on:click={BorrarEntries}>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(306:4) <Button outline color=\\\"danger\\\" on:click={BorrarEntries}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let figure;
    	let div;
    	let t5;
    	let p;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Visualizaciones",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*cargarDatosIniciales*/ ctx[0]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*BorrarEntries*/ ctx[1]);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			create_component(button2.$$.fragment);
    			t4 = space();
    			figure = element("figure");
    			div = element("div");
    			t5 = space();
    			p = element("p");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$6, 290, 4, 10684);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$6, 291, 4, 10754);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$6, 292, 4, 10834);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$6, 293, 4, 10911);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$6, 294, 4, 10990);
    			add_location(br, file$6, 298, 4, 11094);
    			attr_dev(div, "id", "container");
    			add_location(div, file$6, 307, 8, 11451);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$6, 308, 8, 11482);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$6, 306, 4, 11408);
    			add_location(main, file$6, 297, 0, 11083);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			mount_component(button0, main, null);
    			append_dev(main, t2);
    			mount_component(button1, main, null);
    			append_dev(main, t3);
    			mount_component(button2, main, null);
    			append_dev(main, t4);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t5);
    			append_dev(figure, p);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grupal2', slots, []);
    	const BASEUrl = getBASEUrl();
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let xLabel = [];

    	//TENNIS
    	let TennisStats = [];

    	let stats_mostgrandslams = [];
    	let stats_mastersfinals = [];
    	let stats_olympicgoldmedals = [];

    	//PREMIER
    	let PremierStats = [];

    	let appearences_stats = [];
    	let goals_stats = [];
    	let cleansheets_stats = [];

    	//NBA STATS
    	let NBAStats = [];

    	let mostpoints_stats = [];
    	let fieldgoals_stats = [];
    	let efficiency_stats = [];

    	async function cargarDatosIniciales() {
    		const nba3 = await fetch(`${BASEUrl}/api/v2/nba-stats/loadInitialData`);
    		const premier3 = await fetch(`${BASEUrl}/api/v2/premier-league/loadInitialData`);
    		const tennis3 = await fetch(`${BASEUrl}/api/v2/tennis/loadInitialData`);
    		const nba2 = await fetch(`${BASEUrl}/api/v2/nba-stats`);
    		const premier2 = await fetch(`${BASEUrl}/api/v2/premier-league`);
    		const tennis2 = await fetch(`${BASEUrl}/api/v2/tennis`);

    		if (nba3.ok && premier3.ok && tennis3.ok) {
    			if (nba2.ok && premier2.ok && tennis2.ok) {
    				NBAStats = await nba2.json();
    				TennisStats = await tennis2.json();
    				PremierStats = await premier2.json();

    				//Nba
    				NBAStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    				NBAStats.sort((a, b) => a.country > b.country
    				? 1
    				: b.country > a.country ? -1 : 0);

    				NBAStats.forEach(element => {
    					mostpoints_stats.push(parseFloat(element.mostpoints));
    					fieldgoals_stats.push(parseFloat(element.fieldgoals));
    					efficiency_stats.push(parseFloat(element.efficiency));
    				});

    				//Tennis
    				TennisStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    				TennisStats.sort((a, b) => a.country > b.country
    				? 1
    				: b.country > a.country ? -1 : 0);

    				TennisStats.forEach(element => {
    					stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
    					stats_mastersfinals.push(parseFloat(element.masters_finals));
    					stats_olympicgoldmedals.push(parseFloat(element.olympic_gold_medals));
    				});

    				//Premier
    				PremierStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    				PremierStats.sort((a, b) => a.country > b.country
    				? 1
    				: b.country > a.country ? -1 : 0);

    				PremierStats.forEach(element => {
    					appearences_stats.push(parseFloat(element.appearences));
    					cleansheets_stats.push(parseFloat(element.cleanSheets));
    					goals_stats.push(parseFloat(element.goals));
    				});

    				NBAStats.forEach(element => {
    					xLabel.push(element.country + "," + parseInt(element.year));
    				});

    				TennisStats.forEach(element => {
    					xLabel.push(element.country + "," + parseInt(element.year));
    				});

    				PremierStats.forEach(element => {
    					xLabel.push(element.country + "," + parseInt(element.year));
    				});

    				xLabel = new Set(xLabel);
    				xLabel = Array.from(xLabel);
    				xLabel.sort();
    				await delay(500);
    				loadGraph();
    			}
    		}
    	}

    	async function getData() {
    		const nba2 = await fetch(`${BASEUrl}/api/v2/nba-stats`);
    		const premier2 = await fetch(`${BASEUrl}/api/v2/premier-league`);
    		const tennis2 = await fetch(`${BASEUrl}/api/v2/tennis`);

    		if (nba2.ok && premier2.ok && tennis2.ok) {
    			NBAStats = await nba2.json();
    			TennisStats = await tennis2.json();
    			PremierStats = await premier2.json();

    			//Nba
    			NBAStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    			NBAStats.sort((a, b) => a.country > b.country
    			? 1
    			: b.country > a.country ? -1 : 0);

    			NBAStats.forEach(element => {
    				mostpoints_stats.push(parseFloat(element.mostpoints));
    				fieldgoals_stats.push(parseFloat(element.fieldgoals));
    				efficiency_stats.push(parseFloat(element.efficiency));
    			});

    			//Tennis
    			TennisStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    			TennisStats.sort((a, b) => a.country > b.country
    			? 1
    			: b.country > a.country ? -1 : 0);

    			TennisStats.forEach(element => {
    				stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
    				stats_mastersfinals.push(parseFloat(element.masters_finals));
    				stats_olympicgoldmedals.push(parseFloat(element.olympic_gold_medals));
    			});

    			//Premier
    			PremierStats.sort((a, b) => a.year > b.year ? 1 : b.year > a.year ? -1 : 0);

    			PremierStats.sort((a, b) => a.country > b.country
    			? 1
    			: b.country > a.country ? -1 : 0);

    			PremierStats.forEach(element => {
    				appearences_stats.push(parseFloat(element.appearences));
    				cleansheets_stats.push(parseFloat(element.cleanSheets));
    				goals_stats.push(parseFloat(element.goals));
    			});

    			NBAStats.forEach(element => {
    				xLabel.push(element.country + "," + parseInt(element.year));
    			});

    			TennisStats.forEach(element => {
    				xLabel.push(element.country + "," + parseInt(element.year));
    			});

    			PremierStats.forEach(element => {
    				xLabel.push(element.country + "," + parseInt(element.year));
    			});

    			xLabel = new Set(xLabel);
    			xLabel = Array.from(xLabel);
    			xLabel.sort();
    			await delay(500);
    			loadGraph();
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "bar" },
    			title: { text: "Gráficas conjuntas" },
    			subtitle: {
    				text: "APIs: NBA, Premier-League & Tennis | Tipo: Bar"
    			},
    			yAxis: { title: { text: "Valor" } },
    			xAxis: {
    				title: { text: "País-Año" },
    				// categories: stats_country_date,
    				categories: xLabel
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				//Tennis
    				{
    					name: "Grand Slams Ganados",
    					data: stats_mostgrandslams
    				},
    				{
    					name: "Medallas Olimpicas",
    					data: stats_olympicgoldmedals
    				},
    				{
    					name: "Finales de masters",
    					data: stats_mastersfinals
    				},
    				//PremierLeauge
    				{
    					name: "Partidos jugados",
    					data: appearences_stats
    				},
    				{ name: "Goles", data: goals_stats },
    				{
    					name: "Porterias a cero",
    					data: cleansheets_stats
    				},
    				//NBA
    				{
    					name: "Más puntos",
    					data: mostpoints_stats
    				},
    				{
    					name: "Tiros de campo",
    					data: fieldgoals_stats
    				},
    				{
    					name: "Eficiencia",
    					data: efficiency_stats
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getData);

    	async function BorrarEntries() {
    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			try {
    				const nbaDeleteResponse = await fetch(`${BASEUrl}/api/v2/nba-stats`, { method: "DELETE" });
    				const premierDeleteResponse = await fetch(`${BASEUrl}/api/v2/premier-league`, { method: "DELETE" });
    				const tennisDeleteResponse = await fetch(`${BASEUrl}/api/v2/tennis`, { method: "DELETE" });

    				if (nbaDeleteResponse.ok && premierDeleteResponse.ok && tennisDeleteResponse.ok) {
    					console.log("Data deleted and graph updated successfully.");
    					window.location.reload();
    					console.error("Error deleting data.");
    				}
    			} catch(error) {
    				console.error("An error occurred:", error);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Grupal2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getBASEUrl,
    		BASEUrl,
    		onMount,
    		Button,
    		delay,
    		xLabel,
    		TennisStats,
    		stats_mostgrandslams,
    		stats_mastersfinals,
    		stats_olympicgoldmedals,
    		PremierStats,
    		appearences_stats,
    		goals_stats,
    		cleansheets_stats,
    		NBAStats,
    		mostpoints_stats,
    		fieldgoals_stats,
    		efficiency_stats,
    		cargarDatosIniciales,
    		getData,
    		loadGraph,
    		BorrarEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('xLabel' in $$props) xLabel = $$props.xLabel;
    		if ('TennisStats' in $$props) TennisStats = $$props.TennisStats;
    		if ('stats_mostgrandslams' in $$props) stats_mostgrandslams = $$props.stats_mostgrandslams;
    		if ('stats_mastersfinals' in $$props) stats_mastersfinals = $$props.stats_mastersfinals;
    		if ('stats_olympicgoldmedals' in $$props) stats_olympicgoldmedals = $$props.stats_olympicgoldmedals;
    		if ('PremierStats' in $$props) PremierStats = $$props.PremierStats;
    		if ('appearences_stats' in $$props) appearences_stats = $$props.appearences_stats;
    		if ('goals_stats' in $$props) goals_stats = $$props.goals_stats;
    		if ('cleansheets_stats' in $$props) cleansheets_stats = $$props.cleansheets_stats;
    		if ('NBAStats' in $$props) NBAStats = $$props.NBAStats;
    		if ('mostpoints_stats' in $$props) mostpoints_stats = $$props.mostpoints_stats;
    		if ('fieldgoals_stats' in $$props) fieldgoals_stats = $$props.fieldgoals_stats;
    		if ('efficiency_stats' in $$props) efficiency_stats = $$props.efficiency_stats;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cargarDatosIniciales, BorrarEntries];
    }

    class Grupal2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grupal2",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/premier-league/premier.svelte generated by Svelte v3.59.2 */

    const { console: console_1$3 } = globals;
    const file$5 = "src/premier-league/premier.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>     import { getBASEUrl }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>     import { getBASEUrl }",
    		ctx
    	});

    	return block;
    }

    // (279:8) {:then entries}
    function create_then_block(ctx) {
    	let alert_1;
    	let t0;
    	let br0;
    	let t1;
    	let h4;
    	let strong;
    	let t3;
    	let br1;
    	let t4;
    	let table0;
    	let t5;
    	let br2;
    	let t6;
    	let table1;
    	let t7;
    	let button0;
    	let t8;
    	let button1;
    	let t9;
    	let button2;
    	let t10;
    	let button3;
    	let t11;
    	let br3;
    	let t12;
    	let div;
    	let button4;
    	let t13;
    	let button5;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[5],
    				isOpen: /*visible*/ ctx[3],
    				toggle: /*func*/ ctx[14],
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadStats*/ ctx[8]);

    	button1 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteALL*/ ctx[11]);

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*click_handler_2*/ ctx[24]);

    	button3 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*click_handler_3*/ ctx[25]);

    	button4 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button4.$on("click", /*getPreviewPage*/ ctx[13]);

    	button5 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button5.$on("click", /*getNextPage*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			t1 = space();
    			h4 = element("h4");
    			strong = element("strong");
    			strong.textContent = "Búsqueda general de parámetros";
    			t3 = space();
    			br1 = element("br");
    			t4 = space();
    			create_component(table0.$$.fragment);
    			t5 = space();
    			br2 = element("br");
    			t6 = space();
    			create_component(table1.$$.fragment);
    			t7 = space();
    			create_component(button0.$$.fragment);
    			t8 = space();
    			create_component(button1.$$.fragment);
    			t9 = space();
    			create_component(button2.$$.fragment);
    			t10 = space();
    			create_component(button3.$$.fragment);
    			t11 = space();
    			br3 = element("br");
    			t12 = space();
    			div = element("div");
    			create_component(button4.$$.fragment);
    			t13 = space();
    			create_component(button5.$$.fragment);
    			add_location(br0, file$5, 286, 8, 8778);
    			add_location(strong, file$5, 287, 38, 8821);
    			set_style(h4, "text-align", "center");
    			add_location(h4, file$5, 287, 8, 8791);
    			add_location(br1, file$5, 288, 8, 8882);
    			add_location(br2, file$5, 330, 8, 10417);
    			add_location(br3, file$5, 387, 2, 12738);
    			set_style(div, "text-align", "center");
    			add_location(div, file$5, 388, 2, 12745);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, strong);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(button3, target, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(button4, div, null);
    			append_dev(div, t13);
    			mount_component(button5, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty[0] & /*color*/ 32) alert_1_changes.color = /*color*/ ctx[5];
    			if (dirty[0] & /*visible*/ 8) alert_1_changes.isOpen = /*visible*/ ctx[3];
    			if (dirty[0] & /*visible*/ 8) alert_1_changes.toggle = /*func*/ ctx[14];

    			if (dirty[0] & /*checkMSG*/ 16 | dirty[1] & /*$$scope*/ 16384) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, checkMSG*/ 19 | dirty[1] & /*$$scope*/ 16384) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*entries, newEntry*/ 68 | dirty[1] & /*$$scope*/ 16384) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    			const button5_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button5_changes.$$scope = { dirty, ctx };
    			}

    			button5.$set(button5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			transition_in(button5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			transition_out(button5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t4);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t6);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(button3, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div);
    			destroy_component(button4);
    			destroy_component(button5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(279:8) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (282:12) {#if checkMSG}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 16) set_data_dev(t, /*checkMSG*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(282:12) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (281:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_13(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(281:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (304:39) <Button outline color="dark" on:click="{()=>{                         if (from == null || to == null) {                             window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')                         }else{                             checkMSG = "Datos cargados correctamente en ese periodo";                             getEntries();                         }                     }}">
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(304:39) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{                         if (from == null || to == null) {                             window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')                         }else{                             checkMSG = \\\"Datos cargados correctamente en ese periodo\\\";                             getEntries();                         }                     }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (315:39) <Button outline color="info" on:click="{()=>{                         from = null;                         to = null;                         getEntries();                         checkMSG = "Busqueda limpiada";                                              }}">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(315:39) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{                         from = null;                         to = null;                         getEntries();                         checkMSG = \\\"Busqueda limpiada\\\";                                              }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (291:8) <Table bordered>
    function create_default_slot_10(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t4;
    	let th3;
    	let t5;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t6;
    	let td1;
    	let input1;
    	let t7;
    	let td2;
    	let button0;
    	let t8;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[17]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[18]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			th2 = element("th");
    			t4 = space();
    			th3 = element("th");
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t6 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t7 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t8 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$5, 293, 20, 8982);
    			add_location(th1, file$5, 294, 20, 9024);
    			add_location(th2, file$5, 295, 20, 9063);
    			add_location(th3, file$5, 296, 20, 9093);
    			add_location(tr0, file$5, 292, 16, 8957);
    			add_location(thead, file$5, 291, 12, 8933);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "2000");
    			add_location(input0, file$5, 301, 24, 9211);
    			add_location(td0, file$5, 301, 20, 9207);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "2000");
    			add_location(input1, file$5, 302, 24, 9293);
    			add_location(td1, file$5, 302, 20, 9289);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$5, 303, 20, 9369);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$5, 314, 20, 9916);
    			add_location(tr1, file$5, 300, 16, 9182);
    			add_location(tbody, file$5, 299, 12, 9158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t4);
    			append_dev(tr0, th3);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[0]);
    			append_dev(tr1, t6);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[1]);
    			append_dev(tr1, t7);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t8);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 1 && to_number(input0.value) !== /*from*/ ctx[0]) {
    				set_input_value(input0, /*from*/ ctx[0]);
    			}

    			if (dirty[0] & /*to*/ 2 && to_number(input1.value) !== /*to*/ ctx[1]) {
    				set_input_value(input1, /*to*/ ctx[1]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(291:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (352:60) <Button outline color="primary" on:click={insertEntry}>
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(352:60) <Button outline color=\\\"primary\\\" on:click={insertEntry}>",
    		ctx
    	});

    	return block;
    }

    // (364:76) <Button outline color="warning">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(364:76) <Button outline color=\\\"warning\\\">",
    		ctx
    	});

    	return block;
    }

    // (365:20) <Button outline color="danger" on:click="{deleteStat(entry.country, entry.year)}">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(365:20) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteStat(entry.country, entry.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (355:8) {#each entries as entry}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let a0;
    	let t0_value = /*entry*/ ctx[42].country + "";
    	let t0;
    	let a0_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[42].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[42].appearences + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[42].cleanSheets + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[42].goals + "";
    	let t8;
    	let t9;
    	let td5;
    	let a1;
    	let button0;
    	let a1_href_value;
    	let t10;
    	let td6;
    	let button1;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*deleteStat*/ ctx[10](/*entry*/ ctx[42].country, /*entry*/ ctx[42].year))) /*deleteStat*/ ctx[10](/*entry*/ ctx[42].country, /*entry*/ ctx[42].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a0 = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			a1 = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t11 = space();
    			attr_dev(a0, "href", a0_href_value = "api/v2/premier-league/" + /*entry*/ ctx[42].country + "/" + /*entry*/ ctx[42].year);
    			add_location(a0, file$5, 357, 20, 11575);
    			add_location(td0, file$5, 357, 16, 11571);
    			add_location(td1, file$5, 358, 16, 11677);
    			add_location(td2, file$5, 359, 16, 11715);
    			add_location(td3, file$5, 360, 16, 11760);
    			add_location(td4, file$5, 361, 16, 11805);
    			attr_dev(a1, "href", a1_href_value = "#/premier-league/" + /*entry*/ ctx[42].country + "/" + /*entry*/ ctx[42].year);
    			add_location(a1, file$5, 363, 20, 11865);
    			add_location(td5, file$5, 363, 16, 11861);
    			add_location(td6, file$5, 364, 16, 11994);
    			add_location(tr, file$5, 355, 12, 11533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a0);
    			append_dev(a0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, a1);
    			mount_component(button0, a1, null);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*entries*/ 64) && t0_value !== (t0_value = /*entry*/ ctx[42].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*entries*/ 64 && a0_href_value !== (a0_href_value = "api/v2/premier-league/" + /*entry*/ ctx[42].country + "/" + /*entry*/ ctx[42].year)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if ((!current || dirty[0] & /*entries*/ 64) && t2_value !== (t2_value = /*entry*/ ctx[42].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*entries*/ 64) && t4_value !== (t4_value = /*entry*/ ctx[42].appearences + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*entries*/ 64) && t6_value !== (t6_value = /*entry*/ ctx[42].cleanSheets + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*entries*/ 64) && t8_value !== (t8_value = /*entry*/ ctx[42].goals + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (!current || dirty[0] & /*entries*/ 64 && a1_href_value !== (a1_href_value = "#/premier-league/" + /*entry*/ ctx[42].country + "/" + /*entry*/ ctx[42].year)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(355:8) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (333:8) <Table bordered responsive>
    function create_default_slot_6(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button;
    	let t17;
    	let t18;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertEntry*/ ctx[9]);
    	let each_value = /*entries*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Pais";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Apariciones";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Portería vacía";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Goles";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t18 = space();
    			br = element("br");
    			add_location(th0, file$5, 335, 20, 10536);
    			add_location(th1, file$5, 336, 20, 10570);
    			add_location(th2, file$5, 337, 20, 10603);
    			add_location(th3, file$5, 338, 20, 10644);
    			add_location(th4, file$5, 339, 20, 10688);
    			attr_dev(th5, "colspan", "2");
    			add_location(th5, file$5, 340, 20, 10723);
    			add_location(tr0, file$5, 334, 16, 10511);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$5, 333, 12, 10472);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Spain");
    			add_location(input0, file$5, 345, 20, 10845);
    			add_location(td0, file$5, 345, 16, 10841);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "2017");
    			add_location(input1, file$5, 346, 20, 10946);
    			add_location(td1, file$5, 346, 16, 10942);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "13");
    			add_location(input2, file$5, 347, 20, 11042);
    			add_location(td2, file$5, 347, 16, 11038);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "18");
    			add_location(input3, file$5, 348, 20, 11148);
    			add_location(td3, file$5, 348, 16, 11144);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "20");
    			add_location(input4, file$5, 349, 20, 11252);
    			add_location(td4, file$5, 349, 16, 11248);
    			attr_dev(td5, "colspan", "2");
    			set_style(td5, "text-align", "center");
    			add_location(td5, file$5, 351, 16, 11345);
    			add_location(tr1, file$5, 344, 12, 10820);
    			add_location(tbody, file$5, 343, 8, 10800);
    			add_location(br, file$5, 369, 8, 12177);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newEntry*/ ctx[2].country);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newEntry*/ ctx[2].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newEntry*/ ctx[2].appearences);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newEntry*/ ctx[2].cleanSheets);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newEntry*/ ctx[2].goals);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			insert_dev(target, t18, anchor);
    			insert_dev(target, br, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[19]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[20]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[22]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[23])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newEntry*/ 4 && input0.value !== /*newEntry*/ ctx[2].country) {
    				set_input_value(input0, /*newEntry*/ ctx[2].country);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && input1.value !== /*newEntry*/ ctx[2].year) {
    				set_input_value(input1, /*newEntry*/ ctx[2].year);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && to_number(input2.value) !== /*newEntry*/ ctx[2].appearences) {
    				set_input_value(input2, /*newEntry*/ ctx[2].appearences);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && to_number(input3.value) !== /*newEntry*/ ctx[2].cleanSheets) {
    				set_input_value(input3, /*newEntry*/ ctx[2].cleanSheets);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && to_number(input4.value) !== /*newEntry*/ ctx[2].goals) {
    				set_input_value(input4, /*newEntry*/ ctx[2].goals);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*deleteStat, entries*/ 1088) {
    				each_value = /*entries*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(br);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(333:8) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (372:8) <Button color="success" on:click="{loadStats}">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(372:8) <Button color=\\\"success\\\" on:click=\\\"{loadStats}\\\">",
    		ctx
    	});

    	return block;
    }

    // (375:8) <Button color="danger" on:click="{deleteALL}">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(375:8) <Button color=\\\"danger\\\" on:click=\\\"{deleteALL}\\\">",
    		ctx
    	});

    	return block;
    }

    // (378:8) <Button color="info" on:click={function (){             window.location.href = `/#/premier-league/charts`         }}>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(378:8) <Button color=\\\"info\\\" on:click={function (){             window.location.href = `/#/premier-league/charts`         }}>",
    		ctx
    	});

    	return block;
    }

    // (383:8) <Button color="info" on:click={function (){             window.location.href = `/#/premier-league/charts2`         }}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(383:8) <Button color=\\\"info\\\" on:click={function (){             window.location.href = `/#/premier-league/charts2`         }}>",
    		ctx
    	});

    	return block;
    }

    // (390:3) <Button outline color="primary" on:click="{getPreviewPage}">
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Anterior");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(390:3) <Button outline color=\\\"primary\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (393:3) <Button outline color="primary" on:click="{getNextPage}">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Siguiente");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(393:3) <Button outline color=\\\"primary\\\" on:click=\\\"{getNextPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (277:24)              Loading entry stats data...         {:then entries}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading entry stats data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(277:24)              Loading entry stats data...         {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let br;
    	let t0;
    	let h1;
    	let t2;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[6], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			br = element("br");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Tabla de datos de estadísticas de los jugadores de la Premier League";
    			t2 = space();
    			info.block.c();
    			add_location(br, file$5, 272, 4, 8384);
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$5, 274, 4, 8394);
    			add_location(main, file$5, 271, 0, 8373);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*entries*/ 64 && promise !== (promise = /*entries*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Premier', slots, []);
    	const BASEUrl = getBASEUrl();
    	let redStyle = "redTable";
    	let blueStyle = "blueTable";
    	var BASE_API_PATH = `${BASEUrl}/api/v2/premier-league`;
    	let entries = [];
    	let from = null;
    	let to = null;

    	let newEntry = {
    		country: "",
    		year: "",
    		appearences: "",
    		cleanSheets: "",
    		goals: ""
    	};

    	let visible = false;
    	let checkMSG = "";
    	let color = "danger";
    	let page = 1;
    	let totaldata = 20;
    	let offset = 0;
    	let limit = 10;
    	let maxPages = 0;
    	let numEntries;
    	let sCountry = "";
    	let sYear = "";
    	let sAppearences = "";
    	let sCleanSheets = "";
    	let sGoals = "";
    	onMount(getEntries);

    	//GET
    	async function getEntries() {
    		console.log("Fetching entries....");
    		let cadena = `${BASEUrl}/api/v2/premier-league?limit=${limit}&&offset=${offset * 10}&&`;

    		if (from != null) {
    			cadena = cadena + `from=${from}&&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset * 10}`);
    			maxPagesFunction(cadenaPag[0] + cadenaPag[1]);
    			const data = await res.json();
    			$$invalidate(6, entries = data);
    			numEntries = entries.length;
    			console.log("Received entries: " + entries.length);
    		} else {
    			Errores(res.status);
    		}
    	}

    	//GET INITIAL DATA
    	async function loadStats() {
    		console.log("Fetching entry data...");
    		await fetch(BASE_API_PATH + "/loadInitialData");
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, entries = json);
    			$$invalidate(3, visible = true);
    			totaldata = 20;
    			console.log("Received " + entries.length + " entry data.");
    			$$invalidate(5, color = "success");
    			$$invalidate(4, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(5, color = "danger");
    			$$invalidate(4, checkMSG = res.status + ": " + "No se pudo cargar los datos");
    			console.log("ERROR! ");
    		}
    	}

    	//INSERT DATA
    	async function insertEntry() {
    		console.log("Inserting entry....");

    		if (newEntry.country == "" || newEntry.year == null || newEntry.appearences == null || newEntry.cleanSheets == null || newEntry.goals == null) {
    			alert("Los campos no pueden estar vacios");
    		} else {
    			await fetch("BASE_API_PATH", {
    				method: "POST",
    				body: JSON.stringify({
    					country: newEntry.country,
    					year: parseInt(newEntry.year),
    					appearences: parseInt(newEntry.appearences),
    					cleanSheets: parseInt(newEntry.cleanSheets),
    					goals: parseInt(newEntry.goals)
    				}),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(3, visible = true);

    				if (res.status == 201) {
    					getEntries();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Entrada introducida correctamente");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Entrada introducida incorrectamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that country and year in the da tabase"); //window.alert("Entrada introducida incorrectamente");
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Entrada introducida incorrectamente");
    				} //window.alert("Ya existe dicha entrada");
    			});
    		}
    	}

    	//DELETE STAT
    	async function deleteStat(countryD, yearD) {
    		await fetch(BASE_API_PATH + "/" + countryD + "/" + yearD, { method: "DELETE" }).then(function (res) {
    			$$invalidate(3, visible = true);
    			getEntries();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(5, color = "success");
    				$$invalidate(4, checkMSG = "Recurso " + countryD + " " + yearD + " borrado correctamente");
    				console.log("Deleted " + countryD);
    			} else if (res.status == 404) {
    				$$invalidate(5, color = "danger");
    				$$invalidate(4, checkMSG = "No se ha encontrado el objeto " + countryD);
    				console.log("Resource NOT FOUND");
    			} else {
    				$$invalidate(5, color = "danger");
    				$$invalidate(4, checkMSG = res.status + ": " + "No se pudo borrar el recurso");
    				console.log("ERROR!");
    			}
    		});
    	}

    	//DELETE ALL
    	async function deleteALL() {
    		console.log("Deleting entry data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all entry data...");

    			await fetch(BASE_API_PATH, { method: "DELETE" }).then(function (res) {
    				$$invalidate(3, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getEntries();
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(5, color = "danger");
    					$$invalidate(4, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(5, color = "danger");
    					$$invalidate(4, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//getNextPage (B)
    	async function getNextPage() {
    		console.log(totaldata);

    		if (page + 10 > totaldata) {
    			page = 1;
    		} else {
    			page += 10;
    		}

    		$$invalidate(3, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=" + (-1 + page));

    		//condicional imprime msg
    		$$invalidate(5, color = "success");

    		$$invalidate(4, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 9));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(5, color = "danger");
    			$$invalidate(4, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, entries = json);
    			console.log("Received " + entries.length + " resources.");
    		} else {
    			$$invalidate(4, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//getPreviewPage (B)
    	async function getPreviewPage() {
    		console.log(totaldata);

    		if (page - 10 > 1) {
    			page -= 10;
    		} else page = 1;

    		$$invalidate(3, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=" + (-1 + page));
    		$$invalidate(5, color = "success");

    		$$invalidate(4, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 9));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(5, color = "danger");
    			$$invalidate(4, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, entries = json);
    			console.log("Received " + entries.length + " resources.");
    		} else {
    			$$invalidate(4, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//Función auxiliar para obtener el número máximo de páginas que se pueden ver
    	async function maxPagesFunction(cadena) {
    		const res = await fetch(cadena, { method: "GET" });

    		if (res.ok) {
    			const data = await res.json();
    			maxPages = Math.floor(data.length / 10);

    			if (maxPages === data.length / 10) {
    				maxPages = maxPages - 1;
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Premier> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(3, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(0, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(1, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos');
    		} else {
    			$$invalidate(4, checkMSG = "Datos cargados correctamente en ese periodo");
    			getEntries();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, from = null);
    		$$invalidate(1, to = null);
    		getEntries();
    		$$invalidate(4, checkMSG = "Busqueda limpiada");
    	};

    	function input0_input_handler_1() {
    		newEntry.country = this.value;
    		$$invalidate(2, newEntry);
    	}

    	function input1_input_handler_1() {
    		newEntry.year = this.value;
    		$$invalidate(2, newEntry);
    	}

    	function input2_input_handler() {
    		newEntry.appearences = to_number(this.value);
    		$$invalidate(2, newEntry);
    	}

    	function input3_input_handler() {
    		newEntry.cleanSheets = to_number(this.value);
    		$$invalidate(2, newEntry);
    	}

    	function input4_input_handler() {
    		newEntry.goals = to_number(this.value);
    		$$invalidate(2, newEntry);
    	}

    	const click_handler_2 = function () {
    		window.location.href = `/#/premier-league/charts`;
    	};

    	const click_handler_3 = function () {
    		window.location.href = `/#/premier-league/charts2`;
    	};

    	$$self.$capture_state = () => ({
    		getBASEUrl,
    		BASEUrl,
    		onMount,
    		Table,
    		Button,
    		Alert,
    		redStyle,
    		blueStyle,
    		BASE_API_PATH,
    		entries,
    		from,
    		to,
    		newEntry,
    		visible,
    		checkMSG,
    		color,
    		page,
    		totaldata,
    		offset,
    		limit,
    		maxPages,
    		numEntries,
    		sCountry,
    		sYear,
    		sAppearences,
    		sCleanSheets,
    		sGoals,
    		getEntries,
    		loadStats,
    		insertEntry,
    		deleteStat,
    		deleteALL,
    		getNextPage,
    		getPreviewPage,
    		maxPagesFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('redStyle' in $$props) redStyle = $$props.redStyle;
    		if ('blueStyle' in $$props) blueStyle = $$props.blueStyle;
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entries' in $$props) $$invalidate(6, entries = $$props.entries);
    		if ('from' in $$props) $$invalidate(0, from = $$props.from);
    		if ('to' in $$props) $$invalidate(1, to = $$props.to);
    		if ('newEntry' in $$props) $$invalidate(2, newEntry = $$props.newEntry);
    		if ('visible' in $$props) $$invalidate(3, visible = $$props.visible);
    		if ('checkMSG' in $$props) $$invalidate(4, checkMSG = $$props.checkMSG);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    		if ('page' in $$props) page = $$props.page;
    		if ('totaldata' in $$props) totaldata = $$props.totaldata;
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('maxPages' in $$props) maxPages = $$props.maxPages;
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    		if ('sCountry' in $$props) sCountry = $$props.sCountry;
    		if ('sYear' in $$props) sYear = $$props.sYear;
    		if ('sAppearences' in $$props) sAppearences = $$props.sAppearences;
    		if ('sCleanSheets' in $$props) sCleanSheets = $$props.sCleanSheets;
    		if ('sGoals' in $$props) sGoals = $$props.sGoals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		from,
    		to,
    		newEntry,
    		visible,
    		checkMSG,
    		color,
    		entries,
    		getEntries,
    		loadStats,
    		insertEntry,
    		deleteStat,
    		deleteALL,
    		getNextPage,
    		getPreviewPage,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Premier extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Premier",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/premier-league/premierEdit.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;
    const file$4 = "src/premier-league/premierEdit.svelte";

    // (81:8) {#if errorMsg}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*errorMsg*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 64) set_data_dev(t, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(81:8) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (80:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[6] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(80:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (105:20) <Button outline color="primary" on:click={EditEntry}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(105:20) <Button outline color=\\\"primary\\\" on:click={EditEntry}>",
    		ctx
    	});

    	return block;
    }

    // (87:4) <Table bordered>
    function create_default_slot_1$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*params*/ ctx[0].country + "";
    	let t12;
    	let t13;
    	let td1;
    	let t14_value = /*params*/ ctx[0].year + "";
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*EditEntry*/ ctx[7]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Apariciones";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Portería Vacía";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "goles";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$4, 89, 16, 2782);
    			add_location(th1, file$4, 90, 16, 2812);
    			add_location(th2, file$4, 91, 16, 2841);
    			add_location(th3, file$4, 92, 16, 2878);
    			add_location(th4, file$4, 93, 16, 2918);
    			add_location(th5, file$4, 94, 16, 2949);
    			add_location(tr0, file$4, 88, 12, 2761);
    			add_location(thead, file$4, 87, 8, 2741);
    			add_location(td0, file$4, 99, 16, 3051);
    			add_location(td1, file$4, 100, 16, 3093);
    			add_location(input0, file$4, 101, 20, 3136);
    			add_location(td2, file$4, 101, 16, 3132);
    			add_location(input1, file$4, 102, 20, 3203);
    			add_location(td3, file$4, 102, 16, 3199);
    			add_location(input2, file$4, 103, 20, 3270);
    			add_location(td4, file$4, 103, 16, 3266);
    			add_location(td5, file$4, 104, 16, 3327);
    			add_location(tr1, file$4, 98, 12, 3030);
    			add_location(tbody, file$4, 97, 8, 3010);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedappearences*/ ctx[3]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedcleanSheets*/ ctx[4]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedgoals*/ ctx[5]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].country + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*params*/ 1) && t14_value !== (t14_value = /*params*/ ctx[0].year + "")) set_data_dev(t14, t14_value);

    			if (dirty & /*updatedappearences*/ 8 && input0.value !== /*updatedappearences*/ ctx[3]) {
    				set_input_value(input0, /*updatedappearences*/ ctx[3]);
    			}

    			if (dirty & /*updatedcleanSheets*/ 16 && input1.value !== /*updatedcleanSheets*/ ctx[4]) {
    				set_input_value(input1, /*updatedcleanSheets*/ ctx[4]);
    			}

    			if (dirty & /*updatedgoals*/ 32 && input2.value !== /*updatedgoals*/ ctx[5]) {
    				set_input_value(input2, /*updatedgoals*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(87:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (110:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(110:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let t4_value = /*params*/ ctx[0].year + "";
    	let t4;
    	let t5;
    	let t6;
    	let table;
    	let t7;
    	let button;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[2],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[8],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Recurso '");
    			t2 = text(t2_value);
    			t3 = text(" , ");
    			t4 = text(t4_value);
    			t5 = text(" ' listo para editar");
    			t6 = space();
    			create_component(table.$$.fragment);
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$4, 85, 4, 2641);
    			add_location(main, file$4, 77, 0, 2488);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(main, t6);
    			mount_component(table, main, null);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const alert_changes = {};
    			if (dirty & /*color*/ 4) alert_changes.color = /*color*/ ctx[2];
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[8];

    			if (dirty & /*$$scope, errorMsg*/ 524352) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedgoals, updatedcleanSheets, updatedappearences, params*/ 524345) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			destroy_component(table);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PremierEdit', slots, []);
    	const BASEUrl = getBASEUrl();
    	let { params = {} } = $$props;
    	var BASE_API_PATH = `${BASEUrl}/api/v2/premier-league`;
    	let visible = false;
    	let color = "danger";
    	let entry = {};
    	let colorMsg = "danger";
    	let updatedCountry = {};
    	let updatedYear = "";
    	let updatedappearences = "";
    	let updatedcleanSheets = "";
    	let updatedgoals = "";
    	let errorMsg = "";
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch(BASE_API_PATH + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			await res.json();
    			$$invalidate(3, updatedappearences = entry.appearences);
    			$$invalidate(4, updatedcleanSheets = entry.cleanSheets);
    			$$invalidate(5, updatedgoals = entry.goals);
    			console.log("Recived data");
    		} else {
    			$$invalidate(1, visible = true);
    			$$invalidate(2, color = "danger");
    			colorMsg = "Error " + res.status + " : " + " Ningun recurso con los parametros " + params.country + " " + params.year;
    			console.log("ERROR" + errorMsg);
    		}
    	}

    	async function EditEntry() {
    		console.log("Updating entry...." + updatedCountry);

    		await fetch(BASE_API_PATH + "/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year: parseInt(params.year),
    				appearences: updatedappearences,
    				cleanSheets: updatedcleanSheets,
    				goals: updatedgoals
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, visible = true);

    			if (res.status == 200) {
    				getEntries();
    				console.log("Data introduced");
    				$$invalidate(2, color = "success");
    				$$invalidate(6, errorMsg = "Recurso actualizado correctamente");
    			} else {
    				console.log("Data not edited");
    				$$invalidate(6, errorMsg = "Rellene todos los campos");
    			}
    		});
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<PremierEdit> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		updatedappearences = this.value;
    		$$invalidate(3, updatedappearences);
    	}

    	function input1_input_handler() {
    		updatedcleanSheets = this.value;
    		$$invalidate(4, updatedcleanSheets);
    	}

    	function input2_input_handler() {
    		updatedgoals = this.value;
    		$$invalidate(5, updatedgoals);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		pop,
    		onMount,
    		Button,
    		Table,
    		getTransitionDuration,
    		Alert,
    		getBASEUrl,
    		BASEUrl,
    		params,
    		BASE_API_PATH,
    		visible,
    		color,
    		entry,
    		colorMsg,
    		updatedCountry,
    		updatedYear,
    		updatedappearences,
    		updatedcleanSheets,
    		updatedgoals,
    		errorMsg,
    		getEntries,
    		EditEntry
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('entry' in $$props) entry = $$props.entry;
    		if ('colorMsg' in $$props) colorMsg = $$props.colorMsg;
    		if ('updatedCountry' in $$props) updatedCountry = $$props.updatedCountry;
    		if ('updatedYear' in $$props) updatedYear = $$props.updatedYear;
    		if ('updatedappearences' in $$props) $$invalidate(3, updatedappearences = $$props.updatedappearences);
    		if ('updatedcleanSheets' in $$props) $$invalidate(4, updatedcleanSheets = $$props.updatedcleanSheets);
    		if ('updatedgoals' in $$props) $$invalidate(5, updatedgoals = $$props.updatedgoals);
    		if ('errorMsg' in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visible,
    		color,
    		updatedappearences,
    		updatedcleanSheets,
    		updatedgoals,
    		errorMsg,
    		EditEntry,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class PremierEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PremierEdit",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get params() {
    		throw new Error("<PremierEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<PremierEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/premier-league/premierCharts.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/premier-league/premierCharts.svelte";

    // (69:8) <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"             >
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Pagina de visualizaciones");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(69:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Visualizaciones\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (72:8) <Button outline color="btn btn-outline-primary" href="/#/Premier-League"             >
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Front-end Premier-League");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(72:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Premier-League\\\"             >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let div0;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let h2;
    	let t5;
    	let h4;
    	let t7;
    	let div1;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Visualizaciones",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Premier-League",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			h2 = element("h2");
    			h2.textContent = "Gráfica de datos sobre la Premier-League";
    			t5 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Plotly";
    			t7 = space();
    			div1 = element("div");
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.plot.ly/plotly-2.11.1.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$3, 62, 4, 1878);
    			add_location(br, file$3, 66, 4, 1970);
    			attr_dev(div0, "class", "button-container svelte-k9f773");
    			add_location(div0, file$3, 67, 4, 1981);
    			attr_dev(h2, "class", "svelte-k9f773");
    			add_location(h2, file$3, 75, 4, 2303);
    			attr_dev(h4, "class", "svelte-k9f773");
    			add_location(h4, file$3, 76, 4, 2357);
    			attr_dev(div1, "id", "myDiv");
    			add_location(div1, file$3, 77, 4, 2389);
    			add_location(main, file$3, 65, 0, 1959);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t2);
    			mount_component(button1, div0, null);
    			append_dev(main, t3);
    			append_dev(main, h2);
    			append_dev(main, t5);
    			append_dev(main, h4);
    			append_dev(main, t7);
    			append_dev(main, div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PremierCharts', slots, []);
    	const BASEUrl = getBASEUrl();
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_country_date = [];
    	let appearences = [];
    	let cleanSheets = [];
    	let goals = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res = await fetch(`${BASEUrl}/api/v2/premier-league`);

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			//inicializamos los arrays para mostrar los datos
    			data.forEach(stat => {
    				stats_country_date.push(stat.country + "-" + stat.year);
    				appearences.push(stat["appearences"]);
    				cleanSheets.push(stat["cleanSheets"]);
    				goals.push(stat["goals"]);
    			});

    			//esperamos a que se carguen 
    			await delay(500);

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var trace_appearences = {
    			x: stats_country_date,
    			y: appearences,
    			type: 'bar',
    			name: 'Apariciones'
    		};

    		var trace_cleanSheets = {
    			x: stats_country_date,
    			y: cleanSheets,
    			type: 'bar',
    			name: 'Portería vacía'
    		};

    		var trace_goals = {
    			x: stats_country_date,
    			y: goals,
    			type: 'bar',
    			name: 'Goles'
    		};

    		var dataPlot = [trace_appearences, trace_cleanSheets, trace_goals];
    		Plotly.newPlot('myDiv', dataPlot);
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<PremierCharts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getBASEUrl,
    		BASEUrl,
    		delay,
    		data,
    		stats_country_date,
    		Button,
    		appearences,
    		cleanSheets,
    		goals,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('appearences' in $$props) appearences = $$props.appearences;
    		if ('cleanSheets' in $$props) cleanSheets = $$props.cleanSheets;
    		if ('goals' in $$props) goals = $$props.goals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class PremierCharts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PremierCharts",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/premier-league/premierCharts2.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$2 = "src/premier-league/premierCharts2.svelte";

    // (108:8) <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"             >
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Pagina de visualizaciones");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(108:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Visualizaciones\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (111:8) <Button outline color="btn btn-outline-primary" href="/#/Premier-League"             >
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Front-end Premier-League");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(111:8) <Button outline color=\\\"btn btn-outline-primary\\\" href=\\\"/#/Premier-League\\\"             >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let br;
    	let t1;
    	let div0;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let figure;
    	let div1;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Visualizaciones",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "btn btn-outline-primary",
    				href: "/#/Premier-League",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			br = element("br");
    			t1 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			figure = element("figure");
    			div1 = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$2, 95, 4, 2833);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$2, 96, 4, 2904);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$2, 97, 4, 2985);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$2, 98, 4, 3063);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$2, 99, 4, 3142);
    			add_location(br, file$2, 105, 4, 3252);
    			attr_dev(div0, "class", "button-container svelte-qwt7lj");
    			add_location(div0, file$2, 106, 4, 3263);
    			attr_dev(div1, "id", "container");
    			add_location(div1, file$2, 115, 8, 3628);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$2, 114, 4, 3585);
    			add_location(main, file$2, 104, 0, 3241);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, br);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t2);
    			mount_component(button1, div0, null);
    			append_dev(main, t3);
    			append_dev(main, figure);
    			append_dev(figure, div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PremierCharts2', slots, []);
    	const BASEUrl = getBASEUrl();
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_country_date = [];
    	let appearences = [];
    	let cleanSheets = [];
    	let goals = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res = await fetch(`${BASEUrl}/api/v2/premier-league`);

    		if (res.ok) {
    			const data = await res.json();
    			stats = data;
    			console.log("Estadísticas recibidas: " + stats.length);

    			//inicializamos los arrays para mostrar los datos
    			stats.forEach(stat => {
    				stats_country_date.push(stat.country + "-" + stat.year);
    				appearences.push(stat["appearences"]);
    				cleanSheets.push(stat["cleanSheets"]);
    				goals.push(stat["goals"]);
    			});

    			//esperamos para que se carrguen los datos 
    			await delay(500);

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart('container', {
    			chart: { type: 'scatter' },
    			title: { text: 'Datos Premier League' },
    			subtitle: { text: 'Biblioteca: Highcharts' },
    			yAxis: { title: { text: 'Valor' } },
    			xAxis: {
    				title: { text: "País-Año" },
    				categories: stats_country_date
    			},
    			legend: {
    				layout: 'vertical',
    				align: 'right',
    				verticalAlign: 'middle'
    			},
    			series: [
    				{
    					name: 'Más Apariencias',
    					data: appearences
    				},
    				{
    					name: 'Portería Vacía',
    					data: cleanSheets
    				},
    				{ name: 'Goles', data: goals }
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: 'horizontal',
    								align: 'center',
    								verticalAlign: 'bottom'
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<PremierCharts2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getBASEUrl,
    		BASEUrl,
    		delay,
    		stats,
    		Button,
    		stats_country_date,
    		appearences,
    		cleanSheets,
    		goals,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('appearences' in $$props) appearences = $$props.appearences;
    		if ('cleanSheets' in $$props) cleanSheets = $$props.cleanSheets;
    		if ('goals' in $$props) goals = $$props.goals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class PremierCharts2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PremierCharts2",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Visualizaciones.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/Visualizaciones.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div14;
    	let div0;
    	let h1;
    	let t1;
    	let div13;
    	let div1;
    	let t2;
    	let div11;
    	let div4;
    	let div2;
    	let h40;
    	let t4;
    	let div3;
    	let ul0;
    	let li0;
    	let t5;
    	let button0;
    	let a0;
    	let t7;
    	let li1;
    	let t8;
    	let button1;
    	let a1;
    	let t10;
    	let div7;
    	let div5;
    	let h41;
    	let t12;
    	let div6;
    	let ul1;
    	let li2;
    	let t13;
    	let button2;
    	let a2;
    	let t15;
    	let li3;
    	let t16;
    	let button3;
    	let a3;
    	let t18;
    	let div10;
    	let div8;
    	let h42;
    	let t20;
    	let div9;
    	let ul2;
    	let li4;
    	let t21;
    	let button4;
    	let a4;
    	let t23;
    	let li5;
    	let t24;
    	let button5;
    	let a5;
    	let t26;
    	let div12;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div14 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Visualizaciones";
    			t1 = space();
    			div13 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div11 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Visualizaciones Tennis";
    			t4 = space();
    			div3 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			t5 = text("Gráfica 1: Biblioteca Chartjs\n                                ");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "Visualizar";
    			t7 = space();
    			li1 = element("li");
    			t8 = text("Gráfica 2: Biblioteca Highchart\n                                ");
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "Visualizar";
    			t10 = space();
    			div7 = element("div");
    			div5 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Visualizaciones Premier-League";
    			t12 = space();
    			div6 = element("div");
    			ul1 = element("ul");
    			li2 = element("li");
    			t13 = text("Gráfica 1: Biblioteca Plotly\n                                ");
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "Visualizar";
    			t15 = space();
    			li3 = element("li");
    			t16 = text("Gráfica 2: Biblioteca Highchart\n                                ");
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "Visualizar";
    			t18 = space();
    			div10 = element("div");
    			div8 = element("div");
    			h42 = element("h4");
    			h42.textContent = "Visualizaciones Comunes";
    			t20 = space();
    			div9 = element("div");
    			ul2 = element("ul");
    			li4 = element("li");
    			t21 = text("Gráfica 1: Biblioteca Highchart Tipo-Line\n                                ");
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "Visualizar";
    			t23 = space();
    			li5 = element("li");
    			t24 = text("Gráfica 2: Biblioteca Highchart Tipo-Bar\n                                ");
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "Visualizar";
    			t26 = space();
    			div12 = element("div");
    			add_location(h1, file$1, 8, 12, 177);
    			attr_dev(div0, "class", "titulo svelte-1j43p1b");
    			add_location(div0, file$1, 7, 8, 144);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$1, 11, 12, 255);
    			add_location(h40, file$1, 15, 24, 416);
    			attr_dev(div2, "class", "card-header svelte-1j43p1b");
    			add_location(div2, file$1, 14, 20, 366);
    			attr_dev(a0, "href", "/#/tennis/chart");
    			attr_dev(a0, "class", "btn-link svelte-1j43p1b");
    			add_location(a0, file$1, 21, 78, 764);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$1, 21, 32, 718);
    			attr_dev(li0, "class", "list-group-item svelte-1j43p1b");
    			add_location(li0, file$1, 19, 28, 595);
    			attr_dev(a1, "href", "/#/tennis/chart2");
    			attr_dev(a1, "class", "btn-link svelte-1j43p1b");
    			add_location(a1, file$1, 25, 78, 1064);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary");
    			add_location(button1, file$1, 25, 32, 1018);
    			attr_dev(li1, "class", "list-group-item svelte-1j43p1b");
    			add_location(li1, file$1, 23, 28, 893);
    			attr_dev(ul0, "class", "list-group");
    			add_location(ul0, file$1, 18, 24, 543);
    			attr_dev(div3, "class", "card-body");
    			add_location(div3, file$1, 17, 20, 495);
    			attr_dev(div4, "class", "card svelte-1j43p1b");
    			add_location(div4, file$1, 13, 16, 327);
    			add_location(h41, file$1, 33, 24, 1352);
    			attr_dev(div5, "class", "card-header svelte-1j43p1b");
    			add_location(div5, file$1, 32, 20, 1302);
    			attr_dev(a2, "href", "/#/premier-league/charts");
    			attr_dev(a2, "class", "btn-link svelte-1j43p1b");
    			add_location(a2, file$1, 39, 78, 1707);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-primary");
    			add_location(button2, file$1, 39, 32, 1661);
    			attr_dev(li2, "class", "list-group-item svelte-1j43p1b");
    			add_location(li2, file$1, 37, 28, 1539);
    			attr_dev(a3, "href", "#/premier-league/charts2");
    			attr_dev(a3, "class", "btn-link svelte-1j43p1b");
    			add_location(a3, file$1, 43, 78, 2016);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn btn-primary");
    			add_location(button3, file$1, 43, 32, 1970);
    			attr_dev(li3, "class", "list-group-item svelte-1j43p1b");
    			add_location(li3, file$1, 41, 28, 1845);
    			attr_dev(ul1, "class", "list-group");
    			add_location(ul1, file$1, 36, 24, 1487);
    			attr_dev(div6, "class", "card-body");
    			add_location(div6, file$1, 35, 20, 1439);
    			attr_dev(div7, "class", "card svelte-1j43p1b");
    			add_location(div7, file$1, 31, 16, 1263);
    			add_location(h42, file$1, 51, 24, 2312);
    			attr_dev(div8, "class", "card-header svelte-1j43p1b");
    			add_location(div8, file$1, 50, 20, 2262);
    			attr_dev(a4, "href", "/#/Grupal1");
    			attr_dev(a4, "class", "btn-link svelte-1j43p1b");
    			add_location(a4, file$1, 57, 78, 2673);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-primary");
    			add_location(button4, file$1, 57, 32, 2627);
    			attr_dev(li4, "class", "list-group-item svelte-1j43p1b");
    			add_location(li4, file$1, 55, 28, 2492);
    			attr_dev(a5, "href", "#/Grupal2");
    			attr_dev(a5, "class", "btn-link svelte-1j43p1b");
    			add_location(a5, file$1, 61, 78, 2977);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn btn-primary");
    			add_location(button5, file$1, 61, 32, 2931);
    			attr_dev(li5, "class", "list-group-item svelte-1j43p1b");
    			add_location(li5, file$1, 59, 28, 2797);
    			attr_dev(ul2, "class", "list-group");
    			add_location(ul2, file$1, 54, 24, 2440);
    			attr_dev(div9, "class", "card-body");
    			add_location(div9, file$1, 53, 20, 2392);
    			attr_dev(div10, "class", "card svelte-1j43p1b");
    			add_location(div10, file$1, 49, 16, 2223);
    			attr_dev(div11, "class", "col-8");
    			add_location(div11, file$1, 12, 12, 291);
    			attr_dev(div12, "class", "col");
    			add_location(div12, file$1, 67, 12, 3183);
    			attr_dev(div13, "class", "row");
    			add_location(div13, file$1, 10, 8, 225);
    			attr_dev(div14, "class", "container svelte-1j43p1b");
    			add_location(div14, file$1, 6, 4, 112);
    			add_location(main, file$1, 5, 0, 101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div14);
    			append_dev(div14, div0);
    			append_dev(div0, h1);
    			append_dev(div14, t1);
    			append_dev(div14, div13);
    			append_dev(div13, div1);
    			append_dev(div13, t2);
    			append_dev(div13, div11);
    			append_dev(div11, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h40);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, t5);
    			append_dev(li0, button0);
    			append_dev(button0, a0);
    			append_dev(ul0, t7);
    			append_dev(ul0, li1);
    			append_dev(li1, t8);
    			append_dev(li1, button1);
    			append_dev(button1, a1);
    			append_dev(div11, t10);
    			append_dev(div11, div7);
    			append_dev(div7, div5);
    			append_dev(div5, h41);
    			append_dev(div7, t12);
    			append_dev(div7, div6);
    			append_dev(div6, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, t13);
    			append_dev(li2, button2);
    			append_dev(button2, a2);
    			append_dev(ul1, t15);
    			append_dev(ul1, li3);
    			append_dev(li3, t16);
    			append_dev(li3, button3);
    			append_dev(button3, a3);
    			append_dev(div11, t18);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div8, h42);
    			append_dev(div10, t20);
    			append_dev(div10, div9);
    			append_dev(div9, ul2);
    			append_dev(ul2, li4);
    			append_dev(li4, t21);
    			append_dev(li4, button4);
    			append_dev(button4, a4);
    			append_dev(ul2, t23);
    			append_dev(ul2, li5);
    			append_dev(li5, t24);
    			append_dev(li5, button5);
    			append_dev(button5, a5);
    			append_dev(div13, t26);
    			append_dev(div13, div12);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Visualizaciones', slots, []);
    	const BASEUrl = getBASEUrl();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Visualizaciones> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getBASEUrl, BASEUrl });
    	return [];
    }

    class Visualizaciones extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Visualizaciones",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let router;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			add_location(main, file, 80, 0, 2244);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		"/": Home,
    		"/Grupal1": Grupal1,
    		"/Grupal2": Grupal2,
    		"/info": Info,
    		"/about": About,
    		"/analytics": Analytics,
    		"/Productos": ListaProductos,
    		"/Visualizaciones": Visualizaciones,
    		"/tennis": List,
    		"/tennis/:country/:year": Edit,
    		"/tennis/chart": Chart_1,
    		"/tennis/chart2": Chart2,
    		"/twitch": Twitch,
    		"/twitchchart": Twitchchart,
    		"/twitchhub": TwitchHub,
    		"/topTennis": TopHub$1,
    		"/topTennis/list": TopList$1,
    		"/topTennis/chart": TopChart$1,
    		"/tennisFem": TopHub,
    		"/tennisFem/list": TopList,
    		"/tennisFem/chart": TopChart,
    		"/premier-league": Premier,
    		"/premier-league/:country/:year": PremierEdit,
    		"/premier-league/charts": PremierCharts,
    		"/premier-league/charts2": PremierCharts2
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		List,
    		Edit,
    		listaProductos: ListaProductos,
    		Chart: Chart_1,
    		Chart2,
    		TwitchHub,
    		Twitch,
    		TwitchChart: Twitchchart,
    		TopTennis: TopHub$1,
    		ApitennisList: TopList$1,
    		ApitennisChart: TopChart$1,
    		topHubFem: TopHub,
    		topListFem: TopList,
    		topChartFem: TopChart,
    		Info,
    		Footer,
    		Header,
    		Grupal1,
    		Analytics,
    		About,
    		Grupal2,
    		Premier,
    		PremierEdit,
    		PremierChart: PremierCharts,
    		PremierChart2: PremierCharts2,
    		Visualizaciones,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Grupo 23'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
