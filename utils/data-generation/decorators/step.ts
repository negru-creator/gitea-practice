import { test } from '@playwright/test';

function getOriginalClass(instance: any): string {
    return instance.constructor.name;
}

function extractFunctionParamNames(func: Function): {
    paramNames: string[],
    defaultValues: Map<string, any>
} {
    const funcStr = func.toString();
    const match = funcStr.match(/\(([^)]*)\)/);

    const paramNames: string[] = [];
    const defaultValues = new Map<string, any>();

    if (match && match[1]) {
        const params = match[1].split(',').map(p => p.trim());

        params.forEach(param => {
            if (!param) return;

            if (param.includes('=')) {
                const [name, value] = param.split('=').map(p => p.trim());
                const cleanName = name.replace(/:\s*.+/, '').trim();
                paramNames.push(cleanName);

                try {
                    defaultValues.set(cleanName, eval(value));
                } catch {
                    defaultValues.set(cleanName, value);
                }
            } else {
                const cleanName = param.replace(/:\s*.+/, '').trim();
                paramNames.push(cleanName);
            }
        });
    }

    return { paramNames, defaultValues };
}

function safeStringify(value: any): string {
    if (value === undefined) return '';
    if (value === null) return 'null';

    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch {
            return '[Unserializable Object]';
        }
    }

    return String(value);
}

function resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => {
        if (acc && typeof acc === 'object') {
            return acc[key];
        }
        return undefined;
    }, obj);
}

function replacePlaceholders(
    template: string,
    args: any[],
    paramNames: string[],
    defaultValues: Map<string, any>
): string {

    const argsMap: Record<string, any> = {};

    paramNames.forEach((name, index) => {
        argsMap[name] = args[index] !== undefined
            ? args[index]
            : defaultValues.get(name);
    });

    return template.replace(/\{([^}]+)\}/g, (_, placeholder) => {
        if (placeholder.includes('.')) {
            const [root, ...rest] = placeholder.split('.');
            const rootValue = argsMap[root];
            const resolved = resolvePath(rootValue, rest.join('.'));
            return safeStringify(resolved);
        }

        return safeStringify(argsMap[placeholder]);
    });
}

export function step<T>(_stepName?: string) {
    return function (
        target: (...args: any[]) => Promise<T>,
        context: ClassMethodDecoratorContext
    ) {
        return async function (this: any, ...args: any[]): Promise<T> {

            const isStatic = typeof this === 'function';
            const className = isStatic
                ? this.name
                : getOriginalClass(this);

            const methodName = context.name.toString();
            const methodDetails = `${className}.${methodName}`;

            const { paramNames, defaultValues } =
                extractFunctionParamNames(target);

            const formattedName = _stepName
                ? replacePlaceholders(_stepName, args, paramNames, defaultValues)
                : methodDetails;

            const error = new Error();
            const stackLines = error.stack?.split('\n') || [];
            const stackLine = stackLines.find(line =>
                line.includes('.ts:') &&
                !line.includes('step.ts')
            );

            const fileMatch = stackLine?.match(/tests\/(.+)/);
            const finalPath = fileMatch
                ? `.../${fileMatch[1]}`
                : null;

            const stepNameWithStack = finalPath
                ? `${formattedName} - ${methodDetails} — ${finalPath}`
                : `${formattedName} - ${methodDetails}`;

            return await test.step(stepNameWithStack, async () => {
                return await target.call(this, ...args) as T;
            });
        };
    };
}
