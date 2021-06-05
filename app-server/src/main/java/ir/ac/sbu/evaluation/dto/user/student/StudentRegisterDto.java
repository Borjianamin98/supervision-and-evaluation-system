package ir.ac.sbu.evaluation.dto.user.student;

import ir.ac.sbu.evaluation.model.user.Student;
import java.util.Objects;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRegisterDto {

    @NotNull
    private StudentDto student;

    @NotNull
    private long facultyId;

    public StudentRegisterDto() {
    }

    @Builder
    public StudentRegisterDto(StudentDto student, long facultyId) {
        this.student = student;
        this.facultyId = facultyId;
    }

    public static StudentRegisterDto from(Student student, long facultyId) {
        return builder()
                .student(StudentDto.from(student))
                .facultyId(facultyId)
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        StudentRegisterDto that = (StudentRegisterDto) o;
        return facultyId == that.facultyId && Objects.equals(student, that.student);
    }

    @Override
    public int hashCode() {
        return Objects.hash(student, facultyId);
    }
}
