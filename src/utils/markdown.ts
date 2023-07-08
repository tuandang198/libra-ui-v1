import { Reference } from "@/types/types";

export function formatMarkdown(msg: String, references: Reference[]) {
    const content = []
    const refArr: string[] = []
    if (references) {
        references.map((ref) => {
            refArr.push(
                `[[${ref.idInMessage}] `,
                `${ref.title}]`,
                `(${ref.url})  \\\n`,
            );
            msg = msg.replace(`(#${ref.idInMessage})`, `(${ref.url})`)
        });
    }


    const ref = refArr.join("").slice(0, -2);
    content.push(
        "## LIBRA ANSWER: \n",
        msg,
        references ? "\n## CITATION:\n" : "",
        references ? ref : ""
    );
    return content.join("");
}